"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/lib/data";

interface ProjectListProps {
    initialProjects: Project[];
}

export default function ProjectList({ initialProjects }: ProjectListProps) {
    const [filter, setFilter] = useState<string>("ALL");

    const stacks = useMemo(() => {
        const set = new Set<string>();
        initialProjects.forEach((p) =>
            p.stack.forEach((tag) => set.add(tag.stackName))
        );
        return ["ALL", ...Array.from(set)];
    }, [initialProjects]);

    const filteredProjects = useMemo(() => {
        if (filter === "ALL") return initialProjects;
        return initialProjects.filter((p) =>
            p.stack.some((t) => t.stackName === filter)
        );
    }, [filter, initialProjects]);

    return (
        <div className="space-y-8">
            {/* Filter Section */}
            <div className="flex flex-wrap gap-2 justify-center">
                {stacks.map((stack) => (
                    <motion.button
                        key={stack}
                        onClick={() => setFilter(stack)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === stack
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-400/50"
                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                            }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {stack}
                    </motion.button>
                ))}
            </div>

            {/* Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project) => (
                        <motion.article
                            layout
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="group relative flex flex-col h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:shadow-xl hover:shadow-black/50 transition-all duration-300"
                        >
                            {/* Header / Thumbnail */}
                            <div className="p-5 flex items-start gap-4 border-b border-white/5 bg-white/[0.02]">
                                <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-black/40 shadow-inner border border-white/10 group-hover:scale-105 transition-transform duration-300">
                                    <Image
                                        src={project.image?.startsWith("/") ? project.image : `/${project.image ?? "placeholder.svg"}`}
                                        alt={project.name}
                                        fill
                                        className="object-contain p-2"
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-lg font-bold text-white leading-tight group-hover:text-blue-400 transition-colors">
                                        {project.name}
                                    </h3>
                                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                        {project.year && (
                                            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                                                {project.year}
                                            </span>
                                        )}
                                        <span>
                                            {project.stack.length > 0 ? `${project.stack.length} stacks` : "No stack"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex-1 flex flex-col">
                                <p className="text-sm font-medium text-gray-300 mb-2">
                                    {project.summary}
                                </p>
                                {project.description && (
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                                        {project.description}
                                    </p>
                                )}

                                <div className="mt-auto pt-4 flex flex-wrap gap-1.5">
                                    {project.stack.map((tag) => (
                                        <span
                                            key={`${project.id}-${tag.stackName}`}
                                            className="px-2.5 py-1 text-[11px] font-medium text-gray-400 bg-white/5 rounded-md border border-white/5 hover:border-white/20 hover:text-white transition-colors"
                                        >
                                            {tag.stackName}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
