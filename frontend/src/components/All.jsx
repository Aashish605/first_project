import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'


const All = () => {
    const [formType, setFormType] = useState('students')
    const [data, setData] = useState([])


    useEffect(() => {
        const fecthData = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/${formType}/all`)
                console.log(res.data.data)
                setData(res.data.data)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fecthData()
    }, [formType])

    return (
        <>
            <div className="flex items-center gap-3">
                <Link onClick={() => { setFormType('students') }} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:text-indigo-600">
                    Student
                </Link>
                <Link onClick={() => { setFormType('teachers') }} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:text-indigo-600">
                    Teacher
                </Link>
                <Link onClick={() => { setFormType('subjects') }} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:text-indigo-600">
                    Subject
                </Link>
                <Link onClick={() => { setFormType('schools') }} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:text-indigo-600">
                    School
                </Link>
            </div>

            <div className="mt-4">
                {data.map((item, index) => (
                    <div key={index} className="p-2 border-b">
                        {formType === 'students' && (
                            <p>{item.first_name} {item.last_name} - Class: {item.class}, Address: {item.address} , School : {item.school.school_name}
                                <br />
                                {item.enrolledSubjects && item.enrolledSubjects.length > 0 && (
                                    <span>  Enrolled Subjects: {item.enrolledSubjects.map(sub => sub.subject_name).join(', ')}</span>
                                )}
                            </p>
                        )}
                        {formType === 'teachers' && (
                            <p>
                                {item.teacher_name} , {item.specialty?.subject_name ?? 'No subject'} , {item.workplace?.school_name ?? 'No school'}
                            </p>
                        )}
                        {formType === 'subjects' && (
                            <p>{item.subject_name}</p>
                        )}
                        {formType === 'schools' && (
                            <p>{item.school_name} - {item.school_address}</p>
                        )}
                    </div>
                ))}
            </div>

        </>
    )
}

export default All