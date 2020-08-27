FROM node:14-alpine as base
RUN apk add --no-cache gettext git
RUN apk add --no-cache python make g++


#---------- PRODUCTION ----------
FROM base as production
WORKDIR /var/build

COPY package*.json ./

RUN npm install --quiet --unsafe-perm --no-progress --no-audit
# Copy source
COPY . .
# Build dist
RUN npm run build

EXPOSE 3000

#---------- DEVELOPMENT ----------
FROM base as development
WORKDIR /var/build

RUN npm install --quiet --unsafe-perm --no-progress --no-audit

EXPOSE 3000
EXPOSE 9229
## All files will be volume mounted into the container


