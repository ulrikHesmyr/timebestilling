cd server
if(Test-Path -Path build){
    rm -r build
}
cd ../client
npm run build
mv build/ ../server/build
cd ..
git add .
git commit -m "push to server"
git push

Write-host "Suksess!"