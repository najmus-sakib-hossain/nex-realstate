import { NewsCard } from '@/components/cards';
import { PageHero, Section, SectionHeader } from '@/components/sections';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FrontendLayout } from '@/layouts/frontend-layout';
import { useMediaContent, useNewsArticles } from '@/hooks/use-cms';
import { useCMSStore } from '@/stores/cms-store';
import { motion } from 'motion/react';

export default function MediaPage() {
    const { mediaContent, newsArticles } = useCMSStore();
    const { data: serverContent } = useMediaContent();
    const { data: serverArticles } = useNewsArticles();
    const content = serverContent || mediaContent;
    const articles = serverArticles || newsArticles;

    if (!content || !articles) {
        return (
            <FrontendLayout
                title="Media & News"
                description="Stay updated with the latest news, blogs, and press releases from Nex Real Estate."
            >
                <PageHero
                    title="Media & News"
                    subtitle="Stay informed"
                    breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Media & News' }]}
                />
                <div className="flex min-h-[400px] items-center justify-center">
                    <p className="text-muted-foreground">Loading content...</p>
                </div>
            </FrontendLayout>
        );
    }

    const newsFiltered = articles.filter((a) => a.category === 'news');
    const blogArticles = articles.filter((a) => a.category === 'blog');
    const pressArticles = articles.filter((a) => a.category === 'press');
    const launchArticles = articles.filter((a) => a.category === 'launch');

    return (
        <FrontendLayout
            title="Media & News"
            description="Stay updated with the latest news, blogs, and press releases from Nex Real Estate."
        >
            {/* Hero */}
            <PageHero
                title={content.heroSection.title}
                subtitle={content.heroSection.subtitle}
                backgroundImage={content.heroSection.backgroundImage.url}
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Media & News' }]}
            />

            {/* Articles */}
            <Section>
                <Tabs defaultValue="all" className="w-full">
                    <div className="mb-8 flex justify-center">
                        <TabsList>
                            <TabsTrigger value="all">All ({articles.length})</TabsTrigger>
                            <TabsTrigger value="news">News ({newsFiltered.length})</TabsTrigger>
                            <TabsTrigger value="blog">Blog ({blogArticles.length})</TabsTrigger>
                            <TabsTrigger value="press">Press ({pressArticles.length})</TabsTrigger>
                            <TabsTrigger value="launch">Launches ({launchArticles.length})</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="all">
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {articles.map((article, index) => (
                                <motion.div
                                    key={article.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <NewsCard
                                        title={article.title}
                                        excerpt={article.excerpt}
                                        image={article.image.url}
                                        category={article.category}
                                        date={article.publishDate}
                                        slug={article.slug}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>

                    {['news', 'blog', 'press', 'launch'].map((category) => (
                        <TabsContent key={category} value={category}>
                            {articles.filter((a) => a.category === category).length > 0 ? (
                                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                    {articles
                                        .filter((a) => a.category === category)
                                        .map((article, index) => (
                                            <motion.div
                                                key={article.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <NewsCard
                                                    title={article.title}
                                                    excerpt={article.excerpt}
                                                    image={article.image.url}
                                                    category={article.category}
                                                    date={article.publishDate}
                                                    slug={article.slug}
                                                />
                                            </motion.div>
                                        ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-muted-foreground">
                                    No articles in this category.
                                </div>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </Section>
        </FrontendLayout>
    );
}
