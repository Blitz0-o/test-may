Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/bionic64"
config.vm.network "forwarded_port", guest: 80, host: 8888
config.vm.network "forwarded_port", guest: 3000, host: 3001
  config.vm.synced_folder ".", "/home/vagrant/app"

  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y nginx nodejs npm
    npm install -g pm2
    cd /home/vagrant/app
    npm install
    pm2 start index.js
    pm2 save

    cat > /etc/nginx/sites-available/default <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

    systemctl restart nginx
  SHELL
end
