import { useState } from "react";

// type IError = string | null

export function useFetching(callback: () => Promise<void>) {
	let [isLoading, setIsLoading] = useState(false)
	let [error, setError] = useState('')

	async function fetch() {
		try {
			setIsLoading(true)
			setError('')
			await callback()
		}
		catch(error: any) {
			setError(error.message || 'Unknown error')
		}
		finally {
			setIsLoading(false)
		}
	}

	return {fetch, isLoading, error}
}