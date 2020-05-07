#cd app
#npm run serve 
if [ $# -eq 0 ]
  then
    cd app
    npm run serve
fi
if [ $# -eq 1 ]
  then
    cd app
    npm run serve -- --port $1
fi
