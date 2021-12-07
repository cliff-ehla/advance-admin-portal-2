import cookie from 'cookie';

export const handle = async ({ request, resolve }) => {
	const cookies = cookie.parse(request.headers.cookie || '');
	request.locals.access_token = cookies.token;
	if (cookies.user_info) {
		request.locals.user_info = JSON.parse(cookies.user_info);
	}
	return resolve(request);
};
