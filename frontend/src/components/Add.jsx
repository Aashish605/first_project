import { Link } from 'react-router-dom'
import { useState } from 'react'
import School_form from './Form/School_form'
import Subject_form from './Form/Subject_form'
import Student_form from './Form/Student_form'
import Teacher_form from './Form/Teacher_form'
import User_form from './Form/User_form'
import Login_form from './Form/Login_form'

const Add = () => {
    const [formType, setFormType] = useState('Student')

    return (
        <>
            <div className="flex items-center gap-3">
                <Link onClick={() => { setFormType('Student') }} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:text-indigo-600">
                    Student
                </Link>
                <Link onClick={() => { setFormType('Teacher') }}  className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:text-indigo-600">
                    Teacher
                </Link>
                <Link onClick={() => { setFormType('Subject') }} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:text-indigo-600">
                    Subject
                </Link>
                <Link onClick={() => { setFormType('School') }} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:text-indigo-600">
                    School
                </Link>
                <Link onClick={() => { setFormType('User') }} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:text-indigo-600">
                    User
                </Link>
                <Link onClick={() => { setFormType('Login') }} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:text-indigo-600">
                    Login
                </Link>
            </div>

            {formType === 'Student' && <Student_form />}
            {formType === 'Teacher' && <Teacher_form />}
            {formType === 'Subject' && <Subject_form />}
            {formType === 'School' && <School_form />}
            {formType === 'User' && <User_form />}
            {formType === 'Login' && <Login_form />}
        </>
    )
}

export default Add