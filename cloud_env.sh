printenv > .env

echo "DATABASE_URL = $DATABASE_URL"

sed -i "s/%DATABASE_URL%/"$DATABASE_URL"/g" app.yaml
sed -i "s/%JWT_SECRET%/"$JWT_SECRET"/g" app.yaml
sed -i "s/%STAGE%/"$STAGE"/g" app.yaml

cat app.yaml