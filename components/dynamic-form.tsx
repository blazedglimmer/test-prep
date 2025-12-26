'use client';
import React, { useState } from 'react';
import { Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Employment {
  company: string;
  position: string;
  startDate: string;
  salary: string | number;
}

interface EducationItem {
  degree: string;
  institution: string;
  year: string | number;
  gpa: string | number;
}

interface Project {
  name: string;
  description: string;
  url: string;
}

interface FormData {
  personalInfo: PersonalInfo;
  employmentType: string;
  employment: Employment;
  skills: string[];
  education: EducationItem[];
  hasProjects: boolean;
  projects: Project[];
}

type ErrorsMap = Record<string, string>;
type TouchedMap = Record<string, boolean>;

interface InputFieldProps {
  label: string;
  path: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  formData: FormData;
  touched: TouchedMap;
  errors: ErrorsMap;
  handleChange: (path: string, value: unknown) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  path,
  type = 'text',
  required = false,
  placeholder = '',
  formData,
  touched,
  errors,
  handleChange,
}) => {
  const value =
    path.split('.').reduce((obj: any, key: string) => obj?.[key], formData) ??
    '';

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => handleChange(path, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          touched[path] && errors[path] ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {touched[path] && errors[path] && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors[path]}
        </p>
      )}
    </div>
  );
};

const DynamicForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    employmentType: '',
    employment: {
      company: '',
      position: '',
      startDate: '',
      salary: '',
    },
    skills: [''],
    education: [
      {
        degree: '',
        institution: '',
        year: '',
        gpa: '',
      },
    ],
    hasProjects: false,
    projects: [],
  });

  const [errors, setErrors] = useState<ErrorsMap>({});
  const [touched, setTouched] = useState<TouchedMap>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (data: FormData): ErrorsMap => {
    const newErrors: ErrorsMap = {};

    if (!data.personalInfo.firstName.trim()) {
      newErrors['personalInfo.firstName'] = 'First name is required';
    }
    if (!data.personalInfo.lastName.trim()) {
      newErrors['personalInfo.lastName'] = 'Last name is required';
    }
    if (!data.personalInfo.email.trim()) {
      newErrors['personalInfo.email'] = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personalInfo.email)) {
      newErrors['personalInfo.email'] = 'Invalid email format';
    }
    if (
      data.personalInfo.phone &&
      !/^\+?[\d\s-()]{10,}$/.test(data.personalInfo.phone)
    ) {
      newErrors['personalInfo.phone'] = 'Invalid phone number';
    }

    if (!data.employmentType) {
      newErrors['employmentType'] = 'Employment type is required';
    }
    if (data.employmentType === 'employed') {
      if (!data.employment.company.trim()) {
        newErrors['employment.company'] = 'Company name is required';
      }
      if (!data.employment.position.trim()) {
        newErrors['employment.position'] = 'Position is required';
      }
      if (!data.employment.startDate) {
        newErrors['employment.startDate'] = 'Start date is required';
      }
      if (data.employment.salary && isNaN(Number(data.employment.salary))) {
        newErrors['employment.salary'] = 'Salary must be a number';
      }
    }

    data.skills.forEach((skill: string, idx: number) => {
      if (skill.trim() && skill.length < 2) {
        newErrors[`skills.${idx}`] = 'Skill must be at least 2 characters';
      }
    });
    const nonEmptySkills = data.skills.filter((s: string) => s.trim());
    if (nonEmptySkills.length === 0) {
      newErrors['skills'] = 'At least one skill is required';
    }

    data.education.forEach((edu: EducationItem, idx: number) => {
      if (!edu.degree.trim()) {
        newErrors[`education.${idx}.degree`] = 'Degree is required';
      }
      if (!edu.institution.trim()) {
        newErrors[`education.${idx}.institution`] = 'Institution is required';
      }
      if (!edu.year) {
        newErrors[`education.${idx}.year`] = 'Year is required';
      }
      if (
        edu.gpa &&
        (isNaN(Number(edu.gpa)) || Number(edu.gpa) < 0 || Number(edu.gpa) > 4)
      ) {
        newErrors[`education.${idx}.gpa`] = 'GPA must be between 0 and 4';
      }
    });

    if (data.hasProjects) {
      if (data.projects.length === 0) {
        newErrors['projects'] = 'Add at least one project';
      }
      data.projects.forEach((proj: Project, idx: number) => {
        if (!proj.name.trim()) {
          newErrors[`projects.${idx}.name`] = 'Project name is required';
        }
        if (!proj.description.trim()) {
          newErrors[`projects.${idx}.description`] = 'Description is required';
        }
        if (proj.url && !/^https?:\/\/.+/.test(proj.url)) {
          newErrors[`projects.${idx}.url`] = 'Invalid URL format';
        }
      });
    }

    return newErrors;
  };

  const handleChange = (path: string, value: unknown) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newData = JSON.parse(JSON.stringify(prev)) as any;
      let current: any = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;

      return newData as FormData;
    });

    setTouched(prev => ({ ...prev, [path]: true }));

    const newData = JSON.parse(JSON.stringify(formData)) as unknown as Record<
      string,
      any
    >;
    const keys = path.split('.');
    let current: Record<string, any> = newData as Record<string, any>;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    const newErrors = validate(newData as FormData);
    setErrors(newErrors);
  };

  const handleArrayChange = (
    arrayName: string,
    index: number,
    field: string | null,
    value: unknown
  ) => {
    const path = field
      ? `${arrayName}.${index}.${field}`
      : `${arrayName}.${index}`;
    handleChange(path, value);
  };

  const addArrayItem = (arrayName: string, defaultValue: unknown) => {
    setFormData(
      prev =>
        ({
          ...prev,
          [arrayName]: (
            (prev as unknown as Record<string, any>)[arrayName] as any[]
          ).concat([defaultValue]),
        } as any)
    );
  };

  const removeArrayItem = (arrayName: string, index: number) => {
    setFormData(
      prev =>
        ({
          ...prev,
          [arrayName]: (
            (prev as unknown as Record<string, any>)[arrayName] as any[]
          ).filter((_: unknown, i: number) => i !== index),
        } as any)
    );
  };

  const handleSubmit = () => {
    const newErrors = validate(formData);
    setErrors(newErrors);

    const allTouched: TouchedMap = {};
    Object.keys(newErrors).forEach((key: string) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      console.log('Form submitted:', formData);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className=" p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            Form Submitted Successfully!
          </h2>
          <p className="text-gray-600 mb-6">Your information has been saved.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-100 mb-8">
          Professional Profile Form
        </h1>

        <div className="space-y-8">
          <div className=" p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                formData={formData}
                touched={touched}
                errors={errors}
                handleChange={handleChange}
                label="First Name"
                path="personalInfo.firstName"
                required
                placeholder="John"
              />
              <InputField
                formData={formData}
                touched={touched}
                errors={errors}
                handleChange={handleChange}
                label="Last Name"
                path="personalInfo.lastName"
                required
                placeholder="Doe"
              />
              <InputField
                formData={formData}
                touched={touched}
                errors={errors}
                handleChange={handleChange}
                label="Email"
                path="personalInfo.email"
                type="email"
                required
                placeholder="john@example.com"
              />
              <InputField
                formData={formData}
                touched={touched}
                errors={errors}
                handleChange={handleChange}
                label="Phone"
                path="personalInfo.phone"
                placeholder="+1234567890"
              />
            </div>
          </div>

          <div className=" p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Employment Status
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Employment Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.employmentType}
                onChange={e => handleChange('employmentType', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  touched['employmentType'] && errors['employmentType']
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              >
                <option value="">Select...</option>
                <option value="employed">Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="student">Student</option>
                <option value="freelance">Freelance</option>
              </select>
              {touched['employmentType'] && errors['employmentType'] && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors['employmentType']}
                </p>
              )}
            </div>

            {formData.employmentType === 'employed' && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
                <InputField
                  formData={formData}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  label="Company"
                  path="employment.company"
                  required
                  placeholder="Acme Corp"
                />
                <InputField
                  formData={formData}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  label="Position"
                  path="employment.position"
                  required
                  placeholder="Software Engineer"
                />
                <InputField
                  formData={formData}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  label="Start Date"
                  path="employment.startDate"
                  type="date"
                  required
                />
                <InputField
                  formData={formData}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  label="Salary (Annual)"
                  path="employment.salary"
                  type="number"
                  placeholder="75000"
                />
              </div>
            )}
          </div>

          <div className=" p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Skills</h2>
            {formData.skills.map((skill, idx) => (
              <div key={idx} className="flex gap-2 mb-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={skill}
                    onChange={e =>
                      handleArrayChange('skills', idx, null, e.target.value)
                    }
                    placeholder="e.g., JavaScript, Python"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      touched[`skills.${idx}`] && errors[`skills.${idx}`]
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {touched[`skills.${idx}`] && errors[`skills.${idx}`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[`skills.${idx}`]}
                    </p>
                  )}
                </div>
                {formData.skills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('skills', idx)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            {errors['skills'] && (
              <p className="text-sm text-red-600 mb-2">{errors['skills']}</p>
            )}
            <button
              type="button"
              onClick={() => addArrayItem('skills', '')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Skill
            </button>
          </div>

          <div className=" p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Education
            </h2>
            {formData.education.map((edu, idx) => (
              <div key={idx} className="mb-6 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-300">
                    Education {idx + 1}
                  </h3>
                  {formData.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('education', idx)}
                      className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    formData={formData}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    label="Degree"
                    path={`education.${idx}.degree`}
                    required
                    placeholder="Bachelor of Science"
                  />
                  <InputField
                    formData={formData}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    label="Institution"
                    path={`education.${idx}.institution`}
                    required
                    placeholder="University of Technology"
                  />
                  <InputField
                    formData={formData}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    label="Graduation Year"
                    path={`education.${idx}.year`}
                    type="number"
                    required
                    placeholder="2020"
                  />
                  <InputField
                    formData={formData}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    label="GPA (optional)"
                    path={`education.${idx}.gpa`}
                    type="number"
                    placeholder="3.8"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addArrayItem('education', {
                  degree: '',
                  institution: '',
                  year: '',
                  gpa: '',
                })
              }
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Education
            </button>
          </div>

          <div className=" p-6 rounded-lg shadow-md">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasProjects}
                onChange={e => {
                  setFormData(prev => ({
                    ...prev,
                    hasProjects: e.target.checked,
                    projects: e.target.checked
                      ? [{ name: '', description: '', url: '' }]
                      : [],
                  }));
                }}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-lg font-medium text-gray-100">
                I have projects to showcase
              </span>
            </label>

            {formData.hasProjects && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">
                  Projects
                </h3>
                {formData.projects.map((proj, idx) => (
                  <div key={idx} className="mb-6 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-300">
                        Project {idx + 1}
                      </h4>
                      {formData.projects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('projects', idx)}
                          className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <InputField
                        formData={formData}
                        touched={touched}
                        errors={errors}
                        handleChange={handleChange}
                        label="Project Name"
                        path={`projects.${idx}.name`}
                        required
                        placeholder="E-commerce Platform"
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={proj.description}
                          onChange={e =>
                            handleArrayChange(
                              'projects',
                              idx,
                              'description',
                              e.target.value
                            )
                          }
                          placeholder="Brief description of the project..."
                          rows={3}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            touched[`projects.${idx}.description`] &&
                            errors[`projects.${idx}.description`]
                              ? 'border-red-500'
                              : 'border-gray-300'
                          }`}
                        />
                        {touched[`projects.${idx}.description`] &&
                          errors[`projects.${idx}.description`] && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors[`projects.${idx}.description`]}
                            </p>
                          )}
                      </div>
                      <InputField
                        formData={formData}
                        touched={touched}
                        errors={errors}
                        handleChange={handleChange}
                        label="Project URL (optional)"
                        path={`projects.${idx}.url`}
                        placeholder="https://github.com/user/project"
                      />
                    </div>
                  </div>
                ))}
                {errors['projects'] && (
                  <p className="text-sm text-red-600 mb-2">
                    {errors['projects']}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() =>
                    addArrayItem('projects', {
                      name: '',
                      description: '',
                      url: '',
                    })
                  }
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add Project
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => {
                setFormData({
                  personalInfo: {
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                  },
                  employmentType: '',
                  employment: {
                    company: '',
                    position: '',
                    startDate: '',
                    salary: '',
                  },
                  skills: [''],
                  education: [
                    { degree: '', institution: '', year: '', gpa: '' },
                  ],
                  hasProjects: false,
                  projects: [],
                });
                setErrors({});
                setTouched({});
              }}
              className="px-6 py-3 border border-gray-300 text-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Submit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;
