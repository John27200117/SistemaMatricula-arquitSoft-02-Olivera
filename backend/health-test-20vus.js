import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '30s',
};

export default function () {
  const response = http.get('http://localhost:3000/api/v1/health');

  check(response, {
    'estado HTTP 200': (r) => r.status === 200,
    'backend responde OK': (r) => r.json('status') === 'ok',
  });

  sleep(1);
}

