import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function GradientCardExamplePage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Gradient Card Examples</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Primary Gradient */}
        <Card variant="gradient" variantKey="primary">
          <CardHeader>
            <CardTitle>Primary Gradient</CardTitle>
            <CardDescription className="text-white/80">
              A blue to indigo gradient
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-white/90">
              This card uses the primary gradient variant, which transitions
              from blue to indigo. It's perfect for highlighting important
              information or primary actions.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" className="w-full">
              Primary Action
            </Button>
          </CardFooter>
        </Card>

        {/* Secondary Gradient */}
        <Card variant="gradient" variantKey="secondary">
          <CardHeader>
            <CardTitle>Secondary Gradient</CardTitle>
            <CardDescription className="text-white/80">
              A purple to pink gradient
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-white/90">
              This card uses the secondary gradient variant, which transitions
              from purple to pink. It's great for secondary information or
              alternative options.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" className="w-full">
              Secondary Action
            </Button>
          </CardFooter>
        </Card>

        {/* Accent Gradient */}
        <Card variant="gradient" variantKey="accent">
          <CardHeader>
            <CardTitle>Accent Gradient</CardTitle>
            <CardDescription className="text-white/80">
              An amber gradient
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-white/90">
              This card uses the accent gradient variant, which transitions
              through amber shades. It's perfect for highlighting premium or
              special features.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" className="w-full">
              Special Action
            </Button>
          </CardFooter>
        </Card>

        {/* Info Gradient */}
        <Card variant="gradient" variantKey="info">
          <CardHeader>
            <CardTitle>Info Gradient</CardTitle>
            <CardDescription className="text-foreground/80">
              A subtle blue gradient
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90">
              This card uses the info gradient variant, which provides a subtle
              blue background. It's ideal for informational content that doesn't
              need strong emphasis.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Learn More
            </Button>
          </CardFooter>
        </Card>

        {/* Default Gradient */}
        <Card variant="gradient">
          <CardHeader>
            <CardTitle>Default Gradient</CardTitle>
            <CardDescription className="text-foreground/80">
              The default gradient style
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90">
              This card uses the default gradient variant, which is applied when
              no variantKey is specified. It provides a subtle gray gradient
              that works well with the default text color.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Default Action
            </Button>
          </CardFooter>
        </Card>

        {/* Standard Card (for comparison) */}
        <Card>
          <CardHeader>
            <CardTitle>Standard Card</CardTitle>
            <CardDescription>No gradient applied</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              This is a standard card with no gradient applied, shown here for
              comparison. It uses the default background and text colors.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Standard Action</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Usage</h2>
        <Card className="bg-muted">
          <CardContent className="p-6">
            <pre className="text-sm">
              {`<Card variant="gradient" variantKey="primary">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription className="text-white/80">Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-white/90">Card content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button variant="secondary">Action</Button>
  </CardFooter>
</Card>`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
