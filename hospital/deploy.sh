
rm hospital.zip

7z a hospital.zip *

npm test

aws lambda update-function-code --function-name=HospitalAPI --zip-file=fileb://hospital.zip

rm hospital.zip
