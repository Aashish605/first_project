import { useForm } from 'react-hook-form'
import axios from 'axios'

const Subject_form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:3000/api/subjects/add', data, {
        timeout: 5000
      })
      console.log('Server response:', response.data)
      reset()
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to save student information. Please try again.')
    }
  }
  return (
    <section className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Subject Management</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Add new subject
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-500 sm:text-right">
            Complete the form below with the subject information. Fields marked with * are required.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">


          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="subject_name">
              Subject Name<span className="text-red-500">*</span>
            </label>
            <input
              id="subject_name"
              type="text"
              {...register('subject_name', { required: 'Subject name is required' })}
              className={`mt-2 w-full rounded-2xl border px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${errors.subject_name ? 'border-red-300 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 bg-white'}`}
              placeholder="e.g. Mathematics"
              aria-invalid={errors.subject_name ? 'true' : 'false'}
            />
            {errors.subject_name && (
              <p className="mt-2 text-sm text-red-600">{errors.subject_name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600 shadow-sm ring-1 ring-slate-200">
              <p className="font-semibold text-slate-900">Ready to submit</p>
              <p>Review the subject details and click submit when everything is correct.</p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/10 transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto"
            >
              {isSubmitting ? 'Submitting...' : 'Submit subject'}
            </button>
          </div>

          {isSubmitSuccessful && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Subject information saved successfully.
            </div>
          )}
        </form>
      </div>
    </section>
  )
}

export default Subject_form
