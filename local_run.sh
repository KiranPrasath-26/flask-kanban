if [ -d ".env" ];
then
    echo "Enables virtual env"
else
    echo "No Virtual .env Please run setup.sh first"
    exit N
fi

#Activate venv
. .env/bin/activate
export ENV=development
python main.py
deactivate