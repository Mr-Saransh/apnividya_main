import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post('create-order')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async createOrder(@Req() req, @Body() body: { courseId: string }) {
        const userId = req.user.userId || req.user.sub;
        return this.paymentService.createOrder(userId, body.courseId);
    }

    @Post('verify')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async verifyPayment(
        @Req() req,
        @Body()
        body: {
            courseId: string;
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
        },
    ) {
        const userId = req.user.userId || req.user.sub;
        return this.paymentService.verifyPayment(
            userId,
            body.courseId,
            body.razorpay_order_id,
            body.razorpay_payment_id,
            body.razorpay_signature,
        );
    }
}
