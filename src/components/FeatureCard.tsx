import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon: Icon, title, description, index }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="group rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-soft)]"
  >
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
      <Icon className="h-6 w-6 text-secondary-foreground" />
    </div>
    <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">{title}</h3>
    <p className="font-body text-sm leading-relaxed text-muted-foreground">{description}</p>
  </motion.div>
);

export default FeatureCard;
