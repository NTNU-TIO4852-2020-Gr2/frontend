FROM nginx:1-alpine

WORKDIR /www

COPY src/ ./

RUN chown -R nginx:nginx .

# Nginx server config
RUN echo $'server {\n\
    listen 80;\n\
    server_name localhost;\n\
    location / {\n\
        root   /www;\n\
        index  index.html;\n\
    }\n\
    error_page 404 = /404.html;\n\
    absolute_redirect off;\n\
}' > /etc/nginx/conf.d/default.conf

# App config
RUN cp config.template.js config.js

# HTTP port
EXPOSE 80

# Run in foreground
CMD ["nginx", "-g", "daemon off;"]
