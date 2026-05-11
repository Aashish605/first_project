import { useState, useEffect } from 'react'
import axios from 'axios'


const All = () => {
    const [formType, setFormType] = useState('students')
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError('')
            try {
                const res = await axios.get(`${API_BASE}/api/${formType}/all`,{
                    withCredentials: true,
                })
                setData(res.data.data || [])
            } catch (error) {
                setData([])
                setError(error.response?.data?.message || 'Error fetching data')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [formType, API_BASE])

    const tabClass = (active) =>
        `rounded-xl px-4 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset transition-all ${active
            ? 'bg-indigo-600 text-white ring-indigo-600'
            : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50 hover:text-indigo-600'
        }`

    const tableHeaders = {
        students: ['ID', 'First Name', 'Last Name', 'Class', 'Address', 'School', 'Interests', 'Subjects'],
        teachers: ['ID', 'Teacher Name', 'Subject', 'School'],
        subjects: ['ID', 'Subject Name'],
        schools: ['ID', 'School Name', 'Address'],
    }

    const formatInterests = (interests) => {
        if (!interests) return 'No interests'
        let normalized = interests
        if (typeof normalized === 'string') {
            const trimmed = normalized.trim()
            if (!trimmed) return 'No interests'
            try {
                normalized = JSON.parse(trimmed)
            } catch {
                return trimmed
            }
        }

        const collectValues = (value) => {
            if (value == null) return []
            if (Array.isArray(value)) {
                return value.flatMap((item) => collectValues(item))
            }
            if (typeof value === 'object') {
                return Object.values(value).flatMap((item) => collectValues(item))
            }
            return [String(value)]
        }

        const values = collectValues(normalized).filter((v) => v.trim() !== '')
        return values.length ? values.join(', ') : 'No interests'
    }

    const getRowKey = (item) => {
        if (formType === 'students') return item.student_id
        if (formType === 'teachers') return item.Teacher_id
        if (formType === 'subjects') return item.subject_id
        return item.school_id
    }

    return (
        <>
            <div className="flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => { setFormType('students') }} className={tabClass(formType === 'students')}>
                    Student
                </button>
                <button type="button" onClick={() => { setFormType('teachers') }} className={tabClass(formType === 'teachers')}>
                    Teacher
                </button>
                <button type="button" onClick={() => { setFormType('subjects') }} className={tabClass(formType === 'subjects')}>
                    Subject
                </button>
                <button type="button" onClick={() => { setFormType('schools') }} className={tabClass(formType === 'schools')}>
                    School
                </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {loading && <p className="p-4 text-sm text-slate-600">Loading data...</p>}
                {!loading && error && <p className="p-4 text-sm text-red-600">{error}</p>}
                {!loading && !error && data.length === 0 && (
                    <p className="p-4 text-sm text-slate-600">No records found.</p>
                )}
                {!loading && !error && data.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    {tableHeaders[formType].map((header) => (
                                        <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.map((item) => (
                                    <tr key={getRowKey(item)} className="hover:bg-slate-50">
                                        {formType === 'students' && (
                                            <>
                                                <td className="px-4 py-3 text-sm text-slate-700">{item.student_id}</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">{item.first_name}</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">{item.last_name}</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">{item.class}</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">{item.address}</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">{item.school?.school_name ?? 'No school'}</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">{formatInterests(item.interests)}</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">
                                                    {item.enrolledSubjects?.length
                                                        ? item.enrolledSubjects.map((sub) => sub.subject_name).join(', ')
                                                        : 'No subjects'}
                                                </td>
                                            </>
                                        )}
                                        {formType === 'teachers' && (
                                            <>
                                                <td className="px-4 py-3 text-sm text-slate-700">{item.Teacher_id}</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">{item.teacher_name}</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">{item.specialty?.subject_name ?? 'No subject'}</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">{item.workplace?.school_name ?? 'No school'}</td>
                                            </>
                                        )}
                                        {formType === 'subjects' && (
                                            <>
                                                <td className="px-4 py-3 text-sm text-slate-700">{item.subject_id}</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">{item.subject_name}</td>
                                            </>
                                        )}
                                        {formType === 'schools' && (
                                            <>
                                                <td className="px-4 py-3 text-sm text-slate-700">{item.school_id}</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">{item.school_name}</td>
                                                <td className="px-4 py-3 text-sm text-slate-700">{item.school_address}</td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </>
    )
}

export default All