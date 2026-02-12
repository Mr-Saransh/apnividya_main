import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Razorpay = require('razorpay');
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
    private razorpay: Razorpay;

    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        this.razorpay = new Razorpay({
            key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
            key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
        });
    }

    async createOrder(userId: string, courseId: string) {
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });
        if (!course) {
            throw new NotFoundException('Course not found');
        }

        // Check if already enrolled
        const existingEnrollment = await this.prisma.enrollment.findFirst({
            where: { userId, courseId },
        });

        if (existingEnrollment) {
            throw new BadRequestException('Already enrolled in this course');
        }

        const amountInPaise = Math.round(course.price * 100);
        const currency = 'INR';

        const options = {
            amount: amountInPaise,
            currency: currency,
            receipt: `receipt_order_${Date.now()}`,
            notes: {
                courseId: courseId,
                userId: userId,
            },
        };

        try {
            const order = await this.razorpay.orders.create(options);

            // Create Payment Record
            await this.prisma.payment.create({
                data: {
                    userId,
                    courseId,
                    amount: course.price,
                    currency,
                    razorpayOrderId: order.id,
                    status: 'created',
                },
            });

            return order;
        } catch (error) {
            console.error('Error creating Razorpay order:', error);
            throw new BadRequestException('Error creating Razorpay order');
        }
    }

    async verifyPayment(
        userId: string,
        courseId: string,
        razorpayOrderId: string,
        razorpayPaymentId: string,
        razorpaySignature: string,
    ) {
        const secret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
        if (!secret) throw new Error('Razorpay secret key not found');

        const body = razorpayOrderId + '|' + razorpayPaymentId;

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpaySignature) {
            // Payment successful

            // Update Payment Record
            const payment = await this.prisma.payment.findFirst({
                where: { razorpayOrderId: razorpayOrderId }
            });

            if (payment) {
                await this.prisma.payment.update({
                    where: { id: payment.id },
                    data: {
                        razorpayPaymentId: razorpayPaymentId,
                        status: 'success'
                    }
                });
            }

            // Check if enrollment already exists to avoid duplicate enrollment error
            const existingEnrollment = await this.prisma.enrollment.findFirst({
                where: { userId, courseId }
            });

            if (!existingEnrollment) {
                await this.prisma.enrollment.create({
                    data: {
                        userId,
                        courseId,
                    },
                });
            }

            return { status: 'success', message: 'Payment verified and enrolled' };
        } else {

            // Update Payment Record to failed
            const payment = await this.prisma.payment.findFirst({
                where: { razorpayOrderId: razorpayOrderId }
            });

            if (payment) {
                await this.prisma.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: 'failed'
                    }
                });
            }

            throw new BadRequestException('Invalid signature');
        }
    }
}
