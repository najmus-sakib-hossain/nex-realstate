import type { FeaturedProject, Project } from '@/types/cms';
import { Link } from '@inertiajs/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';

interface ProjectCardProps {
    project: Project | FeaturedProject;
    variant?: 'default' | 'featured';
}

export function ProjectCard({ project, variant = 'default' }: ProjectCardProps) {
    const statusVariants: Record<string, 'default' | 'secondary' | 'outline'> = {
        ongoing: 'default',
        completed: 'secondary',
        upcoming: 'outline',
    };

    const categoryLabels = {
        residential: 'Residential',
        commercial: 'Commercial',
        land: 'Land',
        resort: 'Resort',
        hospital: 'Hospital',
        hotel: 'Hotel',
    };

    return (
        <Card className="group overflow-hidden pt-0 transition-shadow hover:shadow-lg">
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={'images' in project ? project.images[0]?.url : project.image.url}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 flex gap-2">
                    <Badge variant={statusVariants[project.status]}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                    <Badge variant="secondary">
                        {categoryLabels[project.category]}
                    </Badge>
                </div>
            </div>
            <CardContent className="p-6">
                <h3 className="mb-2 text-xl font-semibold">{project.title}</h3>
                <p className="mb-3 line-clamp-2 text-muted-foreground">
                    {project.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {project.location}
                </div>
                {'price' in project && project.price && (
                    <p className="mt-3 font-semibold text-primary">{project.price}</p>
                )}
            </CardContent>
            <CardFooter className="px-6 pb-6 pt-0">
                <Button variant="outline" className="w-full gap-2" asChild>
                    <Link href={`/projects/${project.slug}`}>
                        View Details
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

interface ServiceCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    image?: string;
    href?: string;
}

export function ServiceCard({
    title,
    description,
    icon,
    image,
    href,
}: ServiceCardProps) {
    const content = (
        <Card className={`group overflow-hidden transition-shadow hover:shadow-lg ${image ? 'pt-0' : ''}`}>
            {image && (
                <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                        src={image}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 rounded-full bg-background text-foreground p-3">
                        {icon}
                    </div>
                </div>
            )}
            <CardContent className={image ? 'p-6' : 'p-6 pt-8'}>
                {!image && (
                    <div className="mb-4 inline-flex rounded-full bg-primary/10 text-primary-foreground p-3">
                        {icon}
                    </div>
                )}
                <h3 className="mb-2 text-xl font-semibold">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }

    return content;
}

interface TestimonialCardProps {
    name: string;
    position: string;
    company?: string;
    content: string;
    rating: number;
    image: string;
}

export function TestimonialCard({
    name,
    position,
    company,
    content,
    rating,
    image,
}: TestimonialCardProps) {
    return (
        <Card className="p-6">
            <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                        key={i}
                        className={`h-5 w-5 ${i < rating ? 'text-primary' : 'text-muted'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
            <p className="mb-6 text-muted-foreground">&ldquo;{content}&rdquo;</p>
            <div className="flex items-center gap-4">
                <img
                    src={image}
                    alt={name}
                    className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-muted-foreground">
                        {position}
                        {company && `, ${company}`}
                    </p>
                </div>
            </div>
        </Card>
    );
}

interface TeamMemberCardProps {
    name: string;
    position: string;
    bio?: string;
    image: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
        email?: string;
    };
}

export function TeamMemberCard({
    name,
    position,
    bio,
    image,
    socialLinks,
}: TeamMemberCardProps) {
    return (
        <Card className="overflow-hidden pt-0 text-center">
            <div className="aspect-square overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover"
                />
            </div>
            <CardContent className="p-6">
                <h3 className="text-xl font-semibold">{name}</h3>
                <p className="text-primary">{position}</p>
                {bio && (
                    <p className="mt-2 text-sm text-muted-foreground">{bio}</p>
                )}
            </CardContent>
        </Card>
    );
}

interface NewsCardProps {
    title: string;
    excerpt: string;
    image: string;
    category: string;
    date: string;
    slug: string;
}

export function NewsCard({
    title,
    excerpt,
    image,
    category,
    date,
    slug,
}: NewsCardProps) {
    return (
        <Card className="group overflow-hidden pt-0">
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Badge className="absolute left-4 top-4">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                </Badge>
            </div>
            <CardContent className="p-6">
                <p className="mb-2 text-sm text-muted-foreground">{date}</p>
                <h3 className="mb-2 text-xl font-semibold">{title}</h3>
                <p className="line-clamp-2 text-muted-foreground">{excerpt}</p>
            </CardContent>
            <CardFooter className="px-6 pb-6 pt-0">
                <Link
                    href={`/media/${slug}`}
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                    Read More
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </CardFooter>
        </Card>
    );
}

interface JobCardProps {
    title: string;
    department: string;
    location: string;
    type: string;
    experience: string;
    slug: string;
    deadline?: string;
}

export function JobCard({
    title,
    department,
    location,
    type,
    experience,
    slug,
    deadline,
}: JobCardProps) {
    return (
        <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-6">
                <div className="mb-4 flex flex-wrap gap-2">
                    <Badge variant="outline">{department}</Badge>
                    <Badge variant="outline">{type}</Badge>
                </div>
                <h3 className="mb-2 text-xl font-semibold">{title}</h3>
                <div className="mb-4 space-y-1 text-sm text-muted-foreground">
                    <p>📍 {location}</p>
                    <p>💼 {experience}</p>
                    {deadline && <p>⏰ Deadline: {deadline}</p>}
                </div>
            </CardContent>
            <CardFooter className="px-6 pb-6 pt-0">
                <Button className="w-full" asChild>
                    <Link href={`/career/${slug}`}>Apply Now</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
