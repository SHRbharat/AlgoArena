import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { motion, useInView, useAnimation } from "framer-motion";
import { Github, Linkedin, Mail, CodeXml, Trophy, Medal, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypeAnimation } from "react-type-animation";
import { cn } from "@/lib/utils";
import Shivam from "../assets/developers/Shivam.png";
import Somnath from "../assets/developers/Somnath.png";
import Apoorva from "../assets/developers/Apoorva.png";

// FeatureCard Component
function FeatureCard({ title, description, icon: Icon }) {
  return (
    <motion.div
      className="bg-background/90 backdrop-blur-lg border border-primary/20 rounded-2xl p-8 shadow-2xl hover:shadow-primary relative overflow-hidden group transition-all duration-300"
      whileHover={{ y: -10, scale: 1.02 }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-white"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 2, delay: 0.5 }}
        />
      </div>

      <motion.div
        className="bg-gradient-to-br from-primary/10 to-cyan-400/10 p-4 rounded-xl w-fit mb-6 border border-primary/20 backdrop-blur-sm"
        whileHover={{ rotate: 5, scale: 1.05 }}
      >
        <Icon className="h-8 w-8 text-primary text-gray-600 animate-pulse transition-colors" />
      </motion.div>

      <h3 className="text-2xl font-bold mb-3 font-mono bg-white bg-clip-text text-transparent relative inline-block">
        <span className="absolute inset-0 bg-gradient-to-r from-primary/30 to-cyan-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full h-full -skew-x-12" />
        <span className="text-primary dark:text-white">{title}</span>
      </h3>

      <motion.p
        className="text-muted-foreground leading-relaxed font-mono text-base group-hover:text-foreground transition-colors"
        whileHover={{ scale: 1.02 }}
      >
        {description}
      </motion.p>

      <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-cyan-400/10 blur-xl animate-tilt" />
      </div>
    </motion.div>
  );
}

FeatureCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
};

// TeamMember Component
function TeamMember({ name, role, intro, github, linkedin, image }) {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={image || "/placeholder.svg"}
        alt={name}
        className="w-32 h-32 rounded-full mb-4 object-cover shadow-lg border-2 border-primary"
      />
      <h3 className="text-xl font-semibold text-primary">{name}</h3>
      <p className="text-muted-foreground mb-2 font-medium">{role}</p>
      <p className="text-sm mb-4 max-w-xs">{intro}</p>
      <div className="flex space-x-4">
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name}'s GitHub`}
          className="hover:text-primary transition-colors"
        >
          <Github className="h-6 w-6" />
        </a>
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name}'s LinkedIn`}
          className="hover:text-primary transition-colors"
        >
          <Linkedin className="h-6 w-6" />
        </a>
      </div>
    </motion.div>
  );
}

TeamMember.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  intro: PropTypes.string.isRequired,
  github: PropTypes.string.isRequired,
  linkedin: PropTypes.string.isRequired,
  image: PropTypes.string,
};

// AnimatedSection Component
function AnimatedSection({ children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
    >
      {children}
    </motion.div>
  );
}

AnimatedSection.propTypes = {
  children: PropTypes.node.isRequired,
};

// HomePage Component
export function HomePage() {
  return (
    <div className="w-full py-16 space-y-44 relative overflow-hidden">
      <div className="h-10 bg-primary w-full absolute top-0 left-0 z-0 text-sm md:text-lg text-center text-white flex items-center justify-center font-semibold shadow-md ">
        One of the best platforms to improve your coding skills!
      </div>
      <div>
        <div
          className={cn(
            "absolute inset-0 top-10",
            "bottom-[16%]",
            "sm:bottom-[17%]",
            "md:bottom-[13%]",
            "[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
            "z-0"
          )}
        />
        <div className="pointer-events-none absolute inset-0 top-10 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_55%,black)] dark:bg-black"></div>
      </div>
      <section className="text-center space-y-12 relative z-10">
        <motion.div
          className="inline-block relative"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
        >
          <div className="absolute inset-0 bg-primary/10 blur-3xl -z-10" />
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-b from-primary to-foreground bg-clip-text text-transparent tracking-tighter mb-6"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            CompeteNest
          </motion.h1>
        </motion.div>

        <motion.div
          className="text-xl md:text-3xl lg:text-4xl text-muted-foreground font-mono h-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <TypeAnimation
            sequence={[
              "Elevate Your Coding Skills",
              2000,
              "Master Data Structures",
              2000,
              "Conquer Algorithms",
              2000,
              "Win Competitions",
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
        </motion.div>

        <AnimatedSection>
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="relative inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute -inset-1 bg-primary rounded-2xl opacity-90 blur transition duration-1000 group-hover:opacity-100 animate-tilt" />
              <Button
                size="lg"
                className="relative text-lg px-8 py-4 rounded-2xl border-2 border-primary hover:border-primary bg-primary text-white hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Link to="/problems" className="font-mono tracking-tighter">
                  {`> start coding <`}
                </Link>
              </Button>
            </motion.div>
          </div>
        </AnimatedSection>
      </section>

      <AnimatedSection>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 bg-primary ">
          <div className="flex flex-col justify-center p-6 md:p-8 space-y-2 md:space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-mono bg-white bg-clip-text text-transparent relative inline-block">
              <span className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full h-full -skew-x-12" />
              Why CompeteNest?
            </h2>
            <p className="text-muted-foreground font-mono text-lg text-white">
              CompeteNest is a platform to help you improve your coding skills through interactive
              problems, competitive contests, and community support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            <FeatureCard
              title="Interactive Problems"
              description="Solve coding challenges with real-time feedback and detailed solutions."
              icon={CodeXml}
            />
            <FeatureCard
              title="Competitive Contests"
              description="Participate in weekly contests and compete with other developers."
              icon={Trophy}
            />
            <FeatureCard
              title="Leaderboard Rankings"
              description="Track your progress and compare your skills with other developers."
              icon={Medal}
            />
            <FeatureCard
              title="Community Support"
              description="Join our community to discuss problems, contests, and more."
              icon={Users}
            />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <section className="p-2 text-center relative">
          <h2 className="text-4xl font-bold mb-10 md:mb-16 inline-block relative font-mono">
            <span className="bg-gradient-to-r from-primary to-primary dark:from-primary dark:to-white bg-clip-text text-transparent">
              Meet the "Developers"
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            <TeamMember
              name="Shivam Ray"
              role="Full Stack Developer"
              intro="Bridging the gap between elegant user experiences and powerful backend systems."
              github="https://github.com/SHRbharat"
              linkedin="https://www.linkedin.com/in/shivam-ray-b4306524a"
              image={Shivam}
            />
            <TeamMember
              name="Somnath Dwivewdi"
              role="Full Stack Developer"
              intro="Engineering full-stack solutions with scalable backends and seamless frontends."
              github="https://github.com/Somnathdwivedi"
              linkedin="https://www.linkedin.com/in/somnath-dwivedi"
              image={Somnath}
            />
            <TeamMember
              name="Apoorva Sharma"
              role="Frontend Developer"
              intro="Crafting intuitive user interfaces with a focus on performance and accessibility."
              github="https://github.com/Apoorv-032"
              linkedin="https://www.linkedin.com/in/apoorva-sharma-670b011b1"
              image={Apoorva}
            />
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
