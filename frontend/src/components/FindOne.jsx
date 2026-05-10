import  { useState, useEffect } from 'react'
import axios from 'axios'

const FindOne = () => {
    const [formType, setFormType] = useState('students')
    const [id, setId] = useState('')
    const [data, setData] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [editData, setEditData] = useState({})
    const [subjects, setSubjects] = useState([])
    const [schools, setSchools] = useState([])

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [subjectsRes, schoolsRes] = await Promise.all([
                    axios.get('http://localhost:3000/api/subjects/all'),
                    axios.get('http://localhost:3000/api/schools/all')
                ])
                setSubjects(subjectsRes.data.data || [])
                setSchools(schoolsRes.data.data || [])
            } catch (err) {
                console.error('Error fetching options:', err)
            }
        }
        fetchOptions()
    }, [])

    const handleFetch = async () => {
        if (!id) {
            setError('Please enter an ID')
            return
        }
        try {
            const res = await axios.get(`http://localhost:3000/api/${formType}/${id}`)
            const record = res.data.data || res.data
            if (formType === 'students' && record?.enrolledSubjects) {
                record.subject_ids = record.enrolledSubjects.map(subject => subject.subject_id)
            }
            setData(record)
            setEditData(record)
            setError('')
            setSuccess('')
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching data')
            setData(null)
            setEditData({})
        }
    }

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:3000/api/${formType}/${id}`, editData)
            setSuccess('Record updated successfully')
            setError('')
            // Optionally refetch data
            handleFetch()
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating data')
            setSuccess('')
        }
    }

    const handleInputChange = (field, value) => {
        setEditData({ ...editData, [field]: value })
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Find and Update One Record</h2>

            <div className="flex items-center gap-3 mb-4">
                <button onClick={() => { setFormType('students'); setData(null); setError(''); setSuccess(''); setEditData({}) }} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:text-indigo-600">
                    Student
                </button>
                <button onClick={() => { setFormType('teachers'); setData(null); setError(''); setSuccess(''); setEditData({}) }} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:text-indigo-600">
                    Teacher
                </button>
                <button onClick={() => { setFormType('subjects'); setData(null); setError(''); setSuccess(''); setEditData({}) }} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:text-indigo-600">
                    Subject
                </button>
                <button onClick={() => { setFormType('schools'); setData(null); setError(''); setSuccess(''); setEditData({}) }} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:text-indigo-600">
                    School
                </button>
            </div>

            <div className="mb-4">
                <input
                    type="number"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="Enter ID"
                    className="border px-2 py-1 mr-2"
                />
                <button onClick={handleFetch} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                    Fetch
                </button>
                {data && (
                    <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded">
                        Update
                    </button>
                )}
            </div>

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            {data && (
                <div className="p-4 border rounded">
                    {formType === 'students' && (
                        <div>
                            <p><strong>First Name:</strong> <input type="text" value={editData.first_name || ''} onChange={(e) => handleInputChange('first_name', e.target.value)} className="border px-1" /></p>
                            <p><strong>Last Name:</strong> <input type="text" value={editData.last_name || ''} onChange={(e) => handleInputChange('last_name', e.target.value)} className="border px-1" /></p>
                            <p><strong>Class:</strong> <input type="text" value={editData.class || ''} onChange={(e) => handleInputChange('class', e.target.value)} className="border px-1" /></p>
                            <p><strong>Address:</strong> <input type="text" value={editData.address || ''} onChange={(e) => handleInputChange('address', e.target.value)} className="border px-1" /></p>
                            <p><strong>School:</strong>
                                <select value={editData.school_id || ''} onChange={(e) => handleInputChange('school_id', e.target.value)} className="border px-1">
                                    <option value="">Select School</option>
                                    {schools.map(school => (
                                        <option key={school.school_id} value={school.school_id}>{school.school_name}</option>
                                    ))}
                                </select>
                            </p>
                            <p><strong>Subjects:</strong>
                                <select multiple value={editData.subject_ids || []} onChange={(e) => handleInputChange('subject_ids', Array.from(e.target.selectedOptions, option => parseInt(option.value, 10)))} className="border px-1">
                                    {subjects.map(subject => (
                                        <option key={subject.subject_id} value={subject.subject_id}>{subject.subject_name}</option>
                                    ))}
                                </select>
                            </p>
                        </div>
                    )}
                    {formType === 'teachers' && (
                        <div>
                            <p><strong>Name:</strong> <input type="text" value={editData.teacher_name || ''} onChange={(e) => handleInputChange('teacher_name', e.target.value)} className="border px-1" /></p>
                            <p><strong>Subject:</strong> 
                                <select value={editData.subject_id || ''} onChange={(e) => handleInputChange('subject_id', e.target.value)} className="border px-1">
                                    <option value="">Select Subject</option>
                                    {subjects.map(subject => (
                                        <option key={subject.subject_id} value={subject.subject_id}>{subject.subject_name}</option>
                                    ))}
                                </select>
                            </p>
                            <p><strong>School:</strong> 
                                <select value={editData.school_id || ''} onChange={(e) => handleInputChange('school_id', e.target.value)} className="border px-1">
                                    <option value="">Select School</option>
                                    {schools.map(school => (
                                        <option key={school.school_id} value={school.school_id}>{school.school_name}</option>
                                    ))}
                                </select>
                            </p>
                        </div>
                    )}
                    {formType === 'subjects' && (
                        <div>
                            <p><strong>Subject Name:</strong> <input type="text" value={editData.subject_name || ''} onChange={(e) => handleInputChange('subject_name', e.target.value)} className="border px-1" /></p>
                        </div>
                    )}
                    {formType === 'schools' && (
                        <div>
                            <p><strong>School Name:</strong> <input type="text" value={editData.school_name || ''} onChange={(e) => handleInputChange('school_name', e.target.value)} className="border px-1" /></p>
                            <p><strong>Address:</strong> <input type="text" value={editData.school_address || ''} onChange={(e) => handleInputChange('school_address', e.target.value)} className="border px-1" /></p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default FindOne