# Usa a imagem oficial do Nginx
FROM nginx:alpine

# Remove o arquivo de configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia o arquivo de configuração personalizado do Nginx
COPY nginx.conf /etc/nginx/conf.d/

# Copia os arquivos do front-end para o diretório padrão do Nginx
COPY . /usr/share/nginx/html

# Exponha a porta padrão do Nginx
EXPOSE 80
