import { JobDescription } from "@/types/jobDescription";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { GitBranch, GitCommit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TemplateVersionComparisonProps {
  oldVersion: JobDescription;
  newVersion: JobDescription;
}

export function TemplateVersionComparison({
  oldVersion,
  newVersion,
}: TemplateVersionComparisonProps) {
  const renderVersion = (version: JobDescription, isNew: boolean) => (
    <div className="flex-1 p-4">
      <div className="flex items-center gap-2 mb-4">
        {version.metadata.isLatest ? (
          <GitBranch className="h-4 w-4 text-primary" />
        ) : (
          <GitCommit className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="font-medium">Version {version.metadata.version}</span>
        {version.metadata.isLatest && <Badge variant="secondary">Latest</Badge>}
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(version.metadata.createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <h4 className="text-sm font-medium mb-2">Title</h4>
            <p
              className={
                isNew && version.title !== oldVersion.title
                  ? "text-green-600 dark:text-green-400"
                  : ""
              }
            >
              {version.title}
            </p>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-medium mb-2">Description</h4>
            <p
              className={
                isNew && version.description !== oldVersion.description
                  ? "text-green-600 dark:text-green-400"
                  : ""
              }
            >
              {version.description}
            </p>
          </div>

          {/* Responsibilities */}
          <div>
            <h4 className="text-sm font-medium mb-2">Responsibilities</h4>
            <ul className="list-disc pl-4 space-y-1">
              {version.responsibilities.map((resp, i) => (
                <li
                  key={i}
                  className={
                    isNew && !oldVersion.responsibilities.includes(resp)
                      ? "text-green-600 dark:text-green-400"
                      : ""
                  }
                >
                  {resp}
                </li>
              ))}
            </ul>
          </div>

          {/* Required Skills */}
          <div>
            <h4 className="text-sm font-medium mb-2">Required Skills</h4>
            <ul className="list-disc pl-4 space-y-1">
              {version.requirements.required.map((skill, i) => (
                <li
                  key={i}
                  className={
                    isNew && !oldVersion.requirements.required.includes(skill)
                      ? "text-green-600 dark:text-green-400"
                      : ""
                  }
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          {/* Preferred Skills */}
          {version.requirements.preferred &&
            version.requirements.preferred.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Preferred Skills</h4>
                <ul className="list-disc pl-4 space-y-1">
                  {version.requirements.preferred.map((skill, i) => (
                    <li
                      key={i}
                      className={
                        isNew &&
                        !oldVersion.requirements.preferred?.includes(skill)
                          ? "text-green-600 dark:text-green-400"
                          : ""
                      }
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Qualifications */}
          <div>
            <h4 className="text-sm font-medium mb-2">Qualifications</h4>
            {version.qualifications.education && (
              <div className="mb-4">
                <h5 className="text-sm text-muted-foreground mb-1">
                  Education
                </h5>
                <ul className="list-disc pl-4 space-y-1">
                  {version.qualifications.education.map((edu, i) => (
                    <li
                      key={i}
                      className={
                        isNew &&
                        !oldVersion.qualifications.education?.includes(edu)
                          ? "text-green-600 dark:text-green-400"
                          : ""
                      }
                    >
                      {edu}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {version.qualifications.experience && (
              <div className="mb-4">
                <h5 className="text-sm text-muted-foreground mb-1">
                  Experience
                </h5>
                <ul className="list-disc pl-4 space-y-1">
                  {version.qualifications.experience.map((exp, i) => (
                    <li
                      key={i}
                      className={
                        isNew &&
                        !oldVersion.qualifications.experience?.includes(exp)
                          ? "text-green-600 dark:text-green-400"
                          : ""
                      }
                    >
                      {exp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="flex gap-8 min-h-[700px]">
      {/* Old Version */}
      {renderVersion(oldVersion, false)}

      {/* Divider */}
      <div className="w-px bg-border" />

      {/* New Version */}
      {renderVersion(newVersion, true)}
    </div>
  );
}
