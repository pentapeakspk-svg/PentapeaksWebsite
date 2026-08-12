# 🚀 The Ultimate Beginner's Guide: Hosting PentaPeaks on a Hostinger VPS

Don't worry if this is your first time hosting on a VPS! This guide is written specifically for beginners. We will go step-by-step to get your Next.js app and PostgreSQL database running smoothly.

---

## 🛠️ Step 0: Preparation (Do this on your computer first)

Before we touch the server, you need a few things:
1. **Your Server IP Address & Password**: Log into your Hostinger account, go to your VPS dashboard, and find your **Dedicated IP Address** and your **root password**.
2. **Point your Domain (DNS)**: In Hostinger (or wherever you bought your domain), go to DNS settings and create an **A Record** pointing `@` to your **VPS IP Address**, and another **A Record** pointing `www` to your **VPS IP Address**.
3. **Download FileZilla**: Download and install [FileZilla Client](https://filezilla-project.org/) on your computer. This is a drag-and-drop tool to move files from your computer to the server.

---

## 🔌 Step 1: Connect to your VPS (SSH)

SSH is how you send commands to your server. You can use Command Prompt or PowerShell on Windows.

1. Open **PowerShell** or **Command Prompt** on your computer.
2. Type the following command (replace `123.45.67.89` with your actual VPS IP):
   ```bash
   ssh root@187.127.219.164
   ```
3. It might ask "Are you sure you want to continue connecting?". Type **`yes`** and press Enter.
4. It will ask for your password. **Type your Hostinger root password**. *(Note: Nothing will show on the screen while you type the password—this is normal! Just type it and press Enter).*
5. You are now inside your server! 🎉

---

## 📁 Step 2: Upload the Setup Scripts to the Server

We need to send the scripts I created for you from your computer to the VPS.

1. Open **FileZilla** on your computer.
2. At the top, fill in:
   - **Host**: `sftp://123.45.67.89` (Replace with your VPS IP)
   - **Username**: `root`
   - **Password**: Your Hostinger root password
   - **Port**: `22`
3. Click **Quickconnect**.
4. The left side is your computer. The right side is your server (you are in the `/root` folder).
5. On the left side, find your PentaPeaks project folder.
6. Drag and drop these files to the right side (`/root`):
   - `vps-setup.sh`
   - `vps-db-setup.sh`
   - `import-csvs.sh`
   - `deploy-vps.sh`
   - `nginx-pentapeaks.conf`
   - `ecosystem.config.js`
   - `.env.production.example`

---

## ⚙️ Step 3: Run the Server Setup

Go back to your **PowerShell** window (where you are logged into the server).

1. Give the script permission to run:
   ```bash
   chmod +x vps-setup.sh
   ```
2. Run the setup script:
   ```bash
   ./vps-setup.sh
   ```
   *This will take a few minutes. It automatically installs Node.js, PostgreSQL (Database), Nginx (Web Server), and PM2 (App Manager).*

---

## 🗄️ Step 4: Setup Database & Migrate Supabase Data

1. Run the database setup script:
   ```bash
   chmod +x vps-db-setup.sh
   ./vps-db-setup.sh
   ```
   *It will ask you to create a strong password for your database. Remember this!*
2. Note down the `DATABASE_URL` it gives you at the end.

### 📤 Uploading your Supabase CSVs
1. Go back to **FileZilla**.
2. Create a new folder on the right side (server) called `csv_data`.
3. Drag and drop all your downloaded Supabase CSV files into this `csv_data` folder on the server.
4. Go back to **PowerShell** and run the import script:
   ```bash
   chmod +x import-csvs.sh
   ./import-csvs.sh /root/csv_data
   ```
   *This automatically imports all your CSVs into the new database safely!*

---

## 💻 Step 5: Setup Your Application Code

1. Go to the web folder created by the setup script:
   ```bash
   cd /var/www/pentapeaks
   ```
2. Download your project code from GitHub:
   ```bash
   git clone https://github.com/yourusername/pentapeaks.git .
   ```
   *(Don't forget the `.` at the end! Also, replace the link with your actual GitHub repo link).*
3. Create your environment variables file:
   ```bash
   cp /root/.env.production.example .env.production
   nano .env.production
   ```
4. A text editor (`nano`) will open. Use your arrow keys to move around.
   - Paste the `DATABASE_URL` you got in Step 4.
   - Update `NEXTAUTH_URL` to your actual domain name (e.g. `https://pentapeaks.com`).
   - Update all other API keys and email settings.
5. When done, press **`Ctrl + X`**, then **`Y`**, then **`Enter`** to save and exit.

---

## 🌐 Step 6: Configure the Web Server (Nginx & SSL)

1. Move the Nginx configuration file to the right place:
   ```bash
   cp /root/nginx-pentapeaks.conf /etc/nginx/sites-available/pentapeaks
   ```
2. Edit the configuration to add your domain name:
   ```bash
   nano /etc/nginx/sites-available/pentapeaks
   ```
   *Find `server_name yourdomain.com;` and change it to your actual domain name.* Save with `Ctrl+X`, `Y`, `Enter`.
3. Activate the configuration:
   ```bash
   ln -s /etc/nginx/sites-available/pentapeaks /etc/nginx/sites-enabled/
   rm /etc/nginx/sites-enabled/default
   systemctl restart nginx
   ```
4. **Get a Free SSL (HTTPS)**. Run this and follow the prompts:
   ```bash
   certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```
   *(Make sure your domain is actually pointing to the VPS IP, or this will fail).*

---

## 🚀 Step 7: Final Deployment!

1. Copy the PM2 and deploy scripts into the web folder:
   ```bash
   cp /root/ecosystem.config.js /var/www/pentapeaks/
   cp /root/deploy-vps.sh /var/www/pentapeaks/
   chmod +x /var/www/pentapeaks/deploy-vps.sh
   ```
2. Run the deployment script!
   ```bash
   ./deploy-vps.sh
   ```
   *This builds your Next.js app and starts it up!*
3. Tell PM2 to start automatically if the server reboots:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

**🎉 CONGRATULATIONS! Your website is now live on your VPS!**

---

## 🔄 How to update your website in the future:
Whenever you change code on your computer, push it to GitHub using `deploy.bat`. Then:
1. SSH into your VPS: `ssh root@your_server_ip`
2. Run: 
   ```bash
   cd /var/www/pentapeaks
   ./deploy-vps.sh
   ```
