import Link from 'next/link'
import { Clock, Users, CheckCircle, ArrowRight } from 'lucide-react'
import type { Course } from '@/types'

interface CourseCardProps {
  course: Course
  siteSlug: string
}

export default function CourseCard({ course, siteSlug }: CourseCardProps) {
  return (
    <div className="bg-white border border-[#F3DCDC] rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex sm:flex-col">
      {/* Image: fixed width on mobile (horizontal), full width on sm+ (vertical) */}
      {course.image_url ? (
        <img
          src={course.image_url}
          alt={course.title}
          className="w-28 shrink-0 sm:w-full sm:h-44 object-cover self-stretch sm:self-auto"
        />
      ) : (
        <div className="w-28 shrink-0 sm:w-full sm:h-44 bg-gradient-to-br from-[#FDF5F5] to-[#F3DCDC] flex items-center justify-center self-stretch sm:self-auto">
          <span className="text-[#C9C8CB] text-xs hidden sm:block">No image</span>
        </div>
      )}

      <div className="p-3 sm:p-5 flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#7E0D0D] bg-[#FDF5F5] px-2 py-0.5 rounded-full truncate">
            {course.category}
          </span>
          <span className="text-[10px] sm:text-xs text-[#C9C8CB] hidden sm:block">{course.class_level}</span>
        </div>

        <h3 className="font-bold text-[#1B2A44] text-sm sm:text-base mb-1 sm:mb-2 leading-snug line-clamp-2">{course.title}</h3>

        {/* Description: hidden on mobile */}
        <p className="hidden sm:block text-sm text-[#1B2A44] opacity-70 mb-3 line-clamp-2">{course.description}</p>

        {/* Features: show all on sm+, just first one on mobile */}
        {course.features_json && course.features_json.length > 0 && (
          <>
            <ul className="hidden sm:block space-y-1 mb-4">
              {course.features_json.slice(0, 3).map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-[#1B2A44]">
                  <CheckCircle size={12} className="text-[#7E0D0D] shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <p className="sm:hidden text-[11px] text-[#1B2A44] opacity-70 mb-1.5 flex items-center gap-1">
              <CheckCircle size={10} className="text-[#7E0D0D] shrink-0" />
              <span className="line-clamp-1">{course.features_json[0]}</span>
            </p>
          </>
        )}

        {/* Duration/Mode: hidden on mobile */}
        <div className="hidden sm:flex items-center gap-4 text-xs text-[#C9C8CB] mb-4">
          {course.duration && <span className="flex items-center gap-1"><Clock size={12} />{course.duration}</span>}
          <span className="flex items-center gap-1"><Users size={12} />{course.mode}</span>
        </div>

        {course.fee && (
          <p className="text-[11px] sm:text-sm font-bold text-[#1B2A44] mb-2 sm:mb-4">
            From <span className="text-[#7E0D0D]">₹{course.fee}</span>
          </p>
        )}

        <div className="mt-auto">
          <Link
            href={`/${siteSlug}/courses/${course.slug}`}
            className="flex items-center justify-center gap-1.5 w-full border border-[#7E0D0D] text-[#7E0D0D] hover:bg-[#7E0D0D] hover:text-white font-semibold py-2 sm:py-2.5 rounded-xl transition-colors text-xs sm:text-sm"
          >
            Know More <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}
