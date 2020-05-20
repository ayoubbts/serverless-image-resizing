FROM amazonlinux

# Create deploy directory
WORKDIR /deploy

# Install system dependencies
RUN yum -y install make gcc*
RUN curl --silent --location https://rpm.nodesource.com/setup_12.x | bash -
RUN yum -y install nodejs

# Install serverless
RUN npm install -g serverless
RUN npm install --save-dev serverless-plugin-tracing
RUN npm install --save-dev serverless-plugin-datadog

# Copy source
COPY . .

# Install app dependencies
RUN cd /deploy/sre-hiring-test && npm i --production && cd /deploy

#  Run deploy script
CMD ./deploy.sh ; sleep 5m