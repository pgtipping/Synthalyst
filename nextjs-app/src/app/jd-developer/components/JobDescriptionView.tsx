import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, Copy, Edit, Trash2 } from "lucide-react";
import type { JobDescription } from "@/types/jobDescription";

interface JobDescriptionViewProps {
  jd: JobDescription;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (jd: JobDescription) => void;
  onDelete: (id: string) => void;
  onExport: (jd: JobDescription) => void;
  onDuplicate: (jd: JobDescription) => void;
}

export default function JobDescriptionView({
  jd,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onExport,
  onDuplicate,
}: JobDescriptionViewProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[85vh]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                {jd.title}
              </DialogTitle>
              <p className="text-muted-foreground mt-1">
                {jd.department && `${jd.department} • `}
                {jd.location && `${jd.location} • `}
                {jd.employmentType}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {jd.metadata.industry && (
                <Badge variant="outline">{jd.metadata.industry}</Badge>
              )}
              {jd.metadata.level && (
                <Badge variant="outline">{jd.metadata.level}</Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-full pr-4 -mr-4">
          <div className="space-y-6 pb-6">
            <section>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {jd.description}
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
              <ul className="list-disc list-inside space-y-2">
                {jd.responsibilities.map((responsibility, index) => (
                  <li key={index} className="text-muted-foreground">
                    {responsibility}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
              <div className="space-y-2">
                {jd.requirements.required.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="text-muted-foreground">
                      <span className="font-medium">{skill.name}</span>
                      {skill.description && (
                        <span className="ml-2">- {skill.description}</span>
                      )}
                    </div>
                    <Badge>{skill.level}</Badge>
                  </div>
                ))}
              </div>
            </section>

            {jd.requirements.preferred &&
              jd.requirements.preferred.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold mb-2">
                    Preferred Skills
                  </h3>
                  <div className="space-y-2">
                    {jd.requirements.preferred.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="text-muted-foreground">
                          <span className="font-medium">{skill.name}</span>
                          {skill.description && (
                            <span className="ml-2">- {skill.description}</span>
                          )}
                        </div>
                        <Badge>{skill.level}</Badge>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            <section>
              <h3 className="text-lg font-semibold mb-2">Qualifications</h3>

              {jd.qualifications.education &&
                jd.qualifications.education.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-md font-medium mb-2">Education</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {jd.qualifications.education.map((edu, index) => (
                        <li key={index} className="text-muted-foreground">
                          {edu}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {jd.qualifications.experience &&
                jd.qualifications.experience.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-md font-medium mb-2">Experience</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {jd.qualifications.experience.map((exp, index) => (
                        <li key={index} className="text-muted-foreground">
                          {exp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {jd.qualifications.certifications &&
                jd.qualifications.certifications.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-md font-medium mb-2">Certifications</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {jd.qualifications.certifications.map((cert, index) => (
                        <li key={index} className="text-muted-foreground">
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Salary</h3>
              {jd.salary?.range ? (
                <div className="text-muted-foreground">
                  <p>
                    {jd.salary.range.min.toLocaleString()} -{" "}
                    {jd.salary.range.max.toLocaleString()}{" "}
                    {jd.salary.currency || "USD"} per{" "}
                    {jd.salary.type || "yearly"}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">Not specified</p>
              )}
            </section>

            {jd.benefits && jd.benefits.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                <ul className="list-disc list-inside space-y-2">
                  {jd.benefits.map((benefit, index) => (
                    <li key={index} className="text-muted-foreground">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h3 className="text-lg font-semibold mb-2">
                Additional Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {jd.metadata.industry && (
                  <div>
                    <p className="font-medium">Industry</p>
                    <p className="text-muted-foreground">
                      {jd.metadata.industry}
                    </p>
                  </div>
                )}
                {jd.metadata.level && (
                  <div>
                    <p className="font-medium">Level</p>
                    <p className="text-muted-foreground">{jd.metadata.level}</p>
                  </div>
                )}
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-muted-foreground">
                    {new Date(jd.metadata.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-muted-foreground">
                    {new Date(jd.metadata.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t mt-auto">
          <Button variant="outline" size="sm" onClick={() => onDuplicate(jd)}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </Button>
          <Button variant="outline" size="sm" onClick={() => onExport(jd)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(jd)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(jd.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
