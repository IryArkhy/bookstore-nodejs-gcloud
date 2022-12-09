printenv > .env

sed -i "s/%DATABASE_URL%/"$DATABASE_URL"/g" app.yaml
sed -i "s/%JWT_SECRET%/"$JWT_SECRET"/g" app.yaml
sed -i "s/%STAGE%/"$STAGE"/g" app.yaml
sed -i "s/%CLOUDINARY_CLOUD_NAME%/"$CLOUDINARY_CLOUD_NAME"/g" app.yaml
sed -i "s/%CLOUDINARY_API_KEY%/"$CLOUDINARY_API_KEY"/g" app.yaml
sed -i "s/%CLOUDINARY_API_SECRET%/"$CLOUDINARY_API_SECRET"/g" app.yaml

cat app.yaml