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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
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

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
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
                {jd.qualifications.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-muted-foreground">{skill.name}</span>
                    <Badge>{skill.level}</Badge>
                  </div>
                ))}
              </div>
            </section>

            {jd.requirements.preferred &&
              jd.requirements.preferred.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold mb-2">
                    Preferred Requirements
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    {jd.requirements.preferred.map((requirement, index) => (
                      <li key={index} className="text-muted-foreground">
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

            {jd.qualifications.education &&
              jd.qualifications.education.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold mb-2">Education</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {jd.qualifications.education.map((edu, index) => (
                      <li key={index} className="text-muted-foreground">
                        {edu}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

            {jd.qualifications.experience &&
              jd.qualifications.experience.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold mb-2">Experience</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {jd.qualifications.experience.map((exp, index) => (
                      <li key={index} className="text-muted-foreground">
                        {exp}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

            {jd.qualifications.certifications &&
              jd.qualifications.certifications.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold mb-2">Certifications</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {jd.qualifications.certifications.map((cert, index) => (
                      <li key={index} className="text-muted-foreground">
                        {cert}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

            {jd.salary && (
              <section>
                <h3 className="text-lg font-semibold mb-2">Salary</h3>
                <p className="text-muted-foreground">
                  {jd.salary.range
                    ? `${jd.salary.range.min.toLocaleString()} - ${jd.salary.range.max.toLocaleString()} ${
                        jd.salary.currency || "USD"
                      } per ${jd.salary.type}`
                    : `Starting salary per ${jd.salary.type}`}
                </p>
              </section>
            )}

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

        <div className="flex items-center justify-end space-x-2 mt-6 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDuplicate(jd)}
            className="flex items-center"
          >
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExport(jd)}
            className="flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(jd)}
            className="flex items-center"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(jd.id)}
            className="flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
