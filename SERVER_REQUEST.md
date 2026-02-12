# Server Access Request for Apni Vidya Deployment

Hi [Boss's Name],

To deploy the Apni Vidya application (including the AI Tutor, Student Portal, and Admin Panel), I will need access to the server. Since we are running **AI models (Ollama)** and a vector database, the server needs to meet certain requirements.

Could you please provide the following details?

## 1. SSH Access Details
I need to log in to the server to set up the environment and deploy the code.
- **Server IP Address**: (e.g., `123.45.67.89`)
- **Username**: (e.g., `root`, `ubuntu`, or `admin`)
- **Password** OR **SSH Key**: (If using a key, please share the `.pem` file or add my public key)

## 2. Hardware Checks (Crucial for AI)
Since we are hosting **Llama 3.2 (AI Model)** and **Qdrant (Vector DB)** locally on this server, please confirm it has:
- **RAM**: At least **8GB** (16GB recommended). *4GB might crash when the AI is generating answers.*
- **Storage**: At least **20GB - 30GB** free space (for Docker images, Database, and AI Models).
- **OS**: Ubuntu 20.04 / 22.04 LTS (Preferred) or Debian.

## 3. Network & Firewall
Please ensure the following ports are open (or let me know if I need to use different ones):
- **Port 80 & 443**: For standard web traffic (HTTP/HTTPS).
- **Port 3000**: Frontend (Student/Admin Portal).
- **Port 3001**: Backend API.
*(I will set up a reverse proxy to route traffic from 80 -> 3000/3001, but having these open initially helps for testing.)*

## 4. Domain Name (Optional but Recommended)
- Do we have a domain (e.g., `apnividya.com`) ready to point to this server?
- If yes, who manages the DNS (GoDaddy, AWS Route53, Namecheap)? I will need to update the `A Record` to point to the Server IP.

Once I have the **SSH login**, I can handle the rest (installing Docker, setting up the database, and deploying the app).

Thanks!
