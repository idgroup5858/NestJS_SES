
           // .env global
           npm i @nestjs/config
           app.module write ConfigModule 


           // database install 
           npm install --save @nestjs/typeorm typeorm pg

           // hash password
           npm install @nestjs/jwt bcrypt
           npm install @types/bcrypt --save-dev


           //for payload token
           npm install @nestjs/passport passport passport-jwt @nestjs/jwt
           npm install -D @types/passport-jwt
           create jwt.strategy add usermodule 


           //validation
           npm install class-validator class-transformer
           main.ts write ValidationPipe


           npm i nestjs-cls //shared preferences for nodejs

           npm install @nestjs/websockets @nestjs/platform-socket.io socket.io



            url -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
            sudo apt install -y nodejs





            sudo apt install git -y

            sudo apt update
            sudo apt install -y postgresql postgresql-contrib
            sudo systemctl status postgresql
            sudo systemctl start postgresql
            sudo systemctl restart postgresql
            sudo systemctl enable postgresql


            YANGI USER OCHISH
            sudo -u postgres psql

            CREATE USER myuser WITH PASSWORD 'root';
            CREATE DATABASE prses OWNER myuser;
            GRANT ALL PRIVILEGES ON DATABASE prses TO myuser;
            \q

            PAROLNI OZGARTIRISH
            sudo -u postgres psql
            ALTER USER postgres WITH PASSWORD 'root';
            CREATE DATABASE prses OWNER postgres;
            sudo -u postgres psql -l

            \q

            


            DBeaverga ochish

            1

            sudo -u postgres psql -c "SHOW config_file;"
            sudo nano /etc/postgresql/18/main/postgresql.conf
            Ctrl+F #listen_addresses = 'localhost'
            listen_addresses = '*'

            2
            sudo nano /etc/postgresql/18/main/pg_hba.conf
            host    all             all             0.0.0.0/0               md5
            host    all             all             SIZNING_IP/32           md5

            Ctrl+O → Enter, Ctrl+X

            3
            sudo ufw allow 5432/tcp

            sudo systemctl restart postgresql





            npm install
            npm run build
            sudo npm install -g pm2
            pm2 start dist/main.js --name nest-app

            update backend

            git pull
            npm run build
            pm2 restart 0





