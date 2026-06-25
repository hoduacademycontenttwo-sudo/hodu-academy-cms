import Link from 'next/link'
import { Clock, Users, CheckCircle, ArrowRight } from 'lucide-react'
import type { Course } from '@/types'

interface CourseCardProps {
  course: Course
  siteSlug: string
}

export default function CourseCard({ course, siteSlug }: CourseCardProps) {
  return (
    <div className="bg-white border border-[#F3DCDC] rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {course.image_url ? (
        <img src={course.image_url} alt={course.title} className="w-full h-44 object-cover" />
      ) : (
        <div className="w-full h-44 bg-gradient-to-br from-[#FDF5F5] to-[#F3DCDC] flex items-center justify-center">
          <span className="text-[#C9C8CB] text-sm">No image</span>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7E0D0D] bg-[#FDF5F5] px-2 py-0.5 rounded-full">
            {course.category}
          </span>
          <span className="text-xs text-[#C9C8CB]">{course.class_level}</span>
        </div>

        <h3 className="font-bold text-[#1B2A44] text-base mb-2 leading-snug">{course.title}</h3>
        <p className="text-sm text-[#1B2A44] opacity-70 mb-3 line-clamp-2">{course.description}</p>

        {course.features_json && (
          <ul className="space-y-1 mb-4">
            {course.features_json.slice(0, 3).map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-[#1B2A44]">
                <CheckCircle size={12} className="text-[#7E0D0D] shrink-0" /> {f}
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-4 text-xs text-[#C9C8CB] mb-4">
          {course.duration && <span className="flex items-center gap-1"><Clock size={12} />{course.duration}</span>}
          <span className="flex items-center gap-1"><Users size={12} />{course.mode}</span>
        </div>

        {course.fee && (
          <p className="text-sm font-bold text-[#1B2A44] mb-4">
            Starting from <span className="text-[#7E0D0D]">₹{course.fee}</span>
          </p>
        )}

        <div className="mt-auto">
          <Link
            href={`/${siteSlug}/courses/${course.slug}`}
            className="flex items-center justify-center gap-2 w-full border border-[#7E0D0D] text-[#7E0D0D] hover:bg-[#7E0D0D] hover:text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
          >
            Know More <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
