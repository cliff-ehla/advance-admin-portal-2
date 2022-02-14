import * as Sentry from "@sentry/browser";
import {Integrations} from "@sentry/tracing";
let sentry_dsn = import.meta.env.VITE_SENTRY_DSN
let env = import.meta.env.VITE_ENV

const sentry = (() => {
	const init = () => {
		if (['production', 'staging'].includes(env)) {
			Sentry.init({
				dsn: sentry_dsn,
				environment: env,
				integrations: [new Integrations.BrowserTracing()],
				tracesSampleRate: 1.0,
			});
		}
	}

	const log = (error) => {
		if (['production', 'staging'].includes(env)) {
			if (typeof error !== "string") error = JSON.stringify(error)
			Sentry.captureException(new Error(error))
		}
	}

	const setUser = ({username, nickname}) => {
		Sentry.setUser({
			username,
			nickname
		})
	}

	const clearUser = () => {
		Sentry.configureScope(scope => {
			scope.setUser(null)
		})
	}

	return {
		log,
		init,
		setUser,
		clearUser
	}
})()

export {sentry}