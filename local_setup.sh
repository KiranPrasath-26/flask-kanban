#! /bin/sh
echo "============================================================"
echo "Welcome to the setup"
echo "This will setup virtenv, install the req. python libraries"
echo "It can be rerun"
echo "============================================================"

if [ -d ".env" ];
then
    echo ".env folder exists. Installing using pip"
else
    echo "Creating .env and installing pip"
    python3 -m venv .env
fi

# Activate virtual environment
. .env/bin/activate

#Upgrade the PIP
pip install --upgrade pip
pip install -r requirements.txt
#deactivate the virtual environment
deactivate