# Utilisez une image de base Nginx
# FROM nginx:alpine
FROM nginx
# COPY --from=builder /app/build /usr/share/nginx/html

# # Copier la configuration Nginx
# COPY nginx.conf /etc/nginx/nginx_local.conf

# # Copier les fichiers de build de l'application React
# COPY --from=builder /app/build /usr/share/nginx/html
# COPY --from=nginx:latest /etc/nginx/nginx.conf /nginx_local.conf
# RUN rm -rf /root/.npm

# # Donner les droits à nginx
RUN chown -R nginx:nginx /usr/share/nginx/html

# Exposer le port 80 (ou 443 pour HTTPS)
EXPOSE 80

# # Utilisez une image Node.js de base
FROM node:18-alpine as builder

# # Créer le répertoire de travail
WORKDIR /app

# # Copier le package.json et lock.json
COPY package.json .

# # Installer les dépendances
RUN npm install

# # Copier le reste du code source
COPY . .

# # Construire l'application
RUN npm run build

RUN npm start

# Commande par défaut pour lancer Nginx au démarrage du conteneur
# CMD ["/bin/hittasksapp"]
CMD ["npm", "start"]
# CMD ["nginx", "-g", "daemon off;"]
