import { useForm } from 'react-hook-form'
import api from '../../api/client.js'
import { useState } from 'react'

const Login_form = () => {
    const [serverError, setServerError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            user_email: '',
            user_password: '',
        },
    })

    const onSubmit = async (data) => {
        setServerError('')
        setSuccessMessage('')
        try {
            await api.post('/api/users/login', {
                user_email: data.user_email.trim(),
                user_password: data.user_password,
            }, { timeout: 5000 })
            setSuccessMessage(
                'You are signed in. The session token was set as an HTTP-only cookie.'
            )
            reset({ user_email: '', user_password: '' })
            window.dispatchEvent(new Event('edu-auth-changed'))
        } catch (error) {
            const message =
                error.response?.data?.message ??
                'Login failed. Check your connection and try again.'
            setServerError(message)
        }
    }

    return (
        <section className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-10">
                <div className="mb-8 text-center sm:text-left">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
                        Account
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        Sign in
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Enter your email and password to continue.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700" htmlFor="user_email">
                            Email<span className="text-red-500">*</span>
                        </label>
                        <input
                            id="user_email"
                            type="email"
                            autoComplete="email"
                            {...register('user_email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Enter a valid email address',
                                },
                            })}
                            className={`mt-2 w-full rounded-2xl border px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${errors.user_email ? 'border-red-300 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 bg-white'}`}
                            placeholder="you@example.com"
                            aria-invalid={errors.user_email ? 'true' : 'false'}
                        />
                        {errors.user_email && (
                            <p className="mt-2 text-sm text-red-600">{errors.user_email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700" htmlFor="user_password">
                            Password<span className="text-red-500">*</span>
                        </label>
                        <input
                            id="user_password"
                            type="password"
                            autoComplete="current-password"
                            {...register('user_password', { required: 'Password is required' })}
                            className={`mt-2 w-full rounded-2xl border px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${errors.user_password ? 'border-red-300 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 bg-white'}`}
                            placeholder="••••••••"
                            aria-invalid={errors.user_password ? 'true' : 'false'}
                        />
                        {errors.user_password && (
                            <p className="mt-2 text-sm text-red-600">{errors.user_password.message}</p>
                        )}
                    </div>

                    {serverError && (
                        <div
                            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                            role="alert"
                        >
                            {serverError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/10 transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
                    >
                        {isSubmitting ? 'Signing in…' : 'Sign in'}
                    </button>

                    {successMessage && (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            {successMessage}
                        </div>
                    )}
                </form>
            </div>
        </section>
    )
}

export default Login_form
