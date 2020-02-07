FILE=./.env.json
if [ -f "$FILE" ]; then
    echo "I checked $FILE exists - let's go :)"
else
    echo '{"mode": "real"}' >> .env.json
    echo "I created $FILE with default values successfully"
fi