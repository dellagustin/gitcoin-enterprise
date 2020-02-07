FILE=./.env.json
if [ -f "$FILE" ]; then
    echo "I checked $FILE exists - let's go :)"
else
    cp ./.env.template.json ./.env.json
    echo "I created $FILE with default values successfully."
fi