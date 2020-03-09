docker build -t satyamj/fibonacci-calculator-client:latest -t satyamj/fibonacci-calculator-client:$SHA -f ./client/Dockerfile ./client
docker build -t satyamj/fibonacci-calculator-api:latest -t satyamj/fibonacci-calculator-api:latest:$SHA -f ./server/Dockerfile ./server
docker build -t satyamj/fibonacci-calculator-worker:latest -t satyamj/fibonacci-calculator-worker:$SHA -f ./worker/Dockerfile ./worker

docker push satyamj/fibonacci-calculator-client:latest
docker push satyamj/fibonacci-calculator-api:latest
docker push satyamj/fibonacci-calculator-worker:latest

docker push satyamj/fibonacci-calculator-client:$SHA
docker push satyamj/fibonacci-calculator-api:$SHA
docker push satyamj/fibonacci-calculator-worker:$SHA

kubectl apply -f k8s

kubectl set image deployments/client-deployment client=satyamj/fibonacci-calculator-client:$SHA
kubectl set image deployments/server-deployment server=satyamj/fibonacci-calculator-api:$SHA
kubectl set image deployments/worker-deployment worker=satyamj/fibonacci-calculator-worker:$SHA






