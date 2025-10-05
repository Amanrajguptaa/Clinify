'use client'

import React from 'react'
import DoctorCard from '../../components/DoctorCard'

const doctors = [
  {
    name: 'Dr. Sarah Bennett',
    specialization: 'Cardiologist',
    fees: 120,
    isAvailable: true,
    image:
      'https://res.cloudinary.com/dkqbawsqm/image/upload/v1744438993/kipaotl6qtavkxepxffd.png',
  },
  {
    name: 'Dr. James Cooper',
    specialization: 'Dermatologist',
    fees: 90,
    isAvailable: false,
    image:
      'https://res.cloudinary.com/dkqbawsqm/image/upload/v1744438993/kipaotl6qtavkxepxffd.png',
  },
  {
    name: 'Dr. Lisa Morgan',
    specialization: 'Pediatrician',
    fees: 110,
    isAvailable: true,
    image:
      'https://res.cloudinary.com/dkqbawsqm/image/upload/v1744438993/kipaotl6qtavkxepxffd.png',
  },
  {
    name: 'Dr. Ahmed Khan',
    specialization: 'Orthopedic Surgeon',
    fees: 150,
    isAvailable: false,
    image:
      'https://res.cloudinary.com/dkqbawsqm/image/upload/v1744438993/kipaotl6qtavkxepxffd.png',
  },
  {
    name: 'Dr. Ahmed Khan',
    specialization: 'Orthopedic Surgeon',
    fees: 150,
    isAvailable: false,
    image:
      'https://res.cloudinary.com/dkqbawsqm/image/upload/v1744438993/kipaotl6qtavkxepxffd.png',
  },{
    name: 'Dr. Ahmed Khan',
    specialization: 'Orthopedic Surgeon',
    fees: 150,
    isAvailable: false,
    image:
      'https://res.cloudinary.com/dkqbawsqm/image/upload/v1744438993/kipaotl6qtavkxepxffd.png',
  },{
    name: 'Dr. Ahmed Khan',
    specialization: 'Orthopedic Surgeon',
    fees: 150,
    isAvailable: false,
    image:
      'https://res.cloudinary.com/dkqbawsqm/image/upload/v1744438993/kipaotl6qtavkxepxffd.png',
  },
]

const Page = () => {
  return (
    <main className="min-h-screen bg-white p-8 flex justify-center items-center">
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-7xl mx-auto'>
      {doctors.map((doc, idx) => (
        <DoctorCard key={idx} {...doc} />
      ))}
      </div>
    </main>
  )
}

export default Page
