FROM alpine

WORKDIR /app

COPY . .

RUN apk add --no-cache  nodejs npm && \
        rm -rf /var/cache/apk/* && \
        npm i && \
        npm i nodemon


EXPOSE 3001
CMD ["npm", "start"] 
