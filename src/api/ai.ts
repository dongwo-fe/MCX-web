import CreateFetch, { CreateAIFetch } from './fetch';

const http = CreateAIFetch();

export function getComment(prefix: string) {
    return http.get('/GPT2/Comment', { prefix: prefix });
}

export function getLMComment(prompt: string) {
    return http.get('/ChatGLM6B', { prompt });
}
