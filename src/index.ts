/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { z } from 'zod';

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const parsedEnv = z.object({
			TARGET_URL: z.string(),
		}).parse(env);

		const url = new URL(parsedEnv.TARGET_URL);
		// Mantener el path y query original
		const originalUrl = new URL(request.url);
		url.pathname = originalUrl.pathname;
		url.search = originalUrl.search;

		// Clonar headers
		const headers = new Headers(request.headers);
		// Opcional: puedes eliminar o modificar headers aquí si es necesario

		// Preparar el body solo si el método lo permite
		let body = request.body;
		if (request.method === 'GET' || request.method === 'HEAD') {
			body = null;
		}

		const newRequest = new Request(url.toString(), {
			method: request.method,
			headers,
			body,
			redirect: 'manual',
		});

		return fetch(newRequest);
	},
} satisfies ExportedHandler<Env>;
