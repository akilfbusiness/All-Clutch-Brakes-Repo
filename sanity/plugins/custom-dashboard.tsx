import React from "react"
import { Card, Text, Box, Button, Stack, Heading } from "@sanity/ui"

export function CustomDashboard() {
  return (
    <Box padding={4}>
      <Stack space={4}>
        {/* Welcome Section */}
        <Card padding={6} border radius={2} style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)" }}>
          <Stack space={3}>
            <Heading size={2} as="h1" style={{ color: "#fff" }}>
              Welcome to All Clutch & Brake CMS
            </Heading>
            <Text size={1} style={{ color: "#ccc" }}>
              Manage your website content, navigation, services, and locations from here. Everything you need to keep your site up-to-date.
            </Text>
          </Stack>
        </Card>

        {/* Quick Actions */}
        <div>
          <Heading size={1} as="h2" style={{ marginBottom: 16 }}>
            Quick Actions
          </Heading>
          <Stack space={2}>
            <Button
              as="a"
              href="/studio/editor/mainNavigation"
              text="Edit Navigation"
              size="large"
              tone="primary"
              style={{ width: "100%", textAlign: "center" }}
            />
            <Button
              as="a"
              href="/studio/intent/create/schema=post"
              text="Create New Blog Post"
              size="large"
              tone="positive"
              style={{ width: "100%", textAlign: "center" }}
            />
            <Button
              as="a"
              href="/studio/intent/create/schema=service"
              text="Add Service"
              size="large"
              style={{ width: "100%", textAlign: "center" }}
            />
            <Button
              as="a"
              href="/studio/intent/create/schema=location"
              text="Add Location"
              size="large"
              style={{ width: "100%", textAlign: "center" }}
            />
          </Stack>
        </div>

        {/* Help Section */}
        <Card padding={4} border>
          <Stack space={2}>
            <Heading size={0} as="h3">
              Need Help?
            </Heading>
            <Text size={0}>
              <strong>Navigation:</strong> Edit menu structure and footer links from the Navigation section.
            </Text>
            <Text size={0}>
              <strong>Content:</strong> Use "All Pages" to see every page in your site, or browse by type (Services, Blog, Locations).
            </Text>
            <Text size={0}>
              <strong>Templates:</strong> When creating new content, use pre-built templates to maintain consistency.
            </Text>
            <Text size={0}>
              <strong>Preview:</strong> Click the Preview button before publishing to see your changes on the live site.
            </Text>
          </Stack>
        </Card>

        {/* Info Section */}
        <Card padding={4} border tone="caution">
          <Stack space={2}>
            <Heading size={0} as="h3">
              Tips for Best Results
            </Heading>
            <Text size={0}>
              - Always fill in SEO fields (Page Title, Meta Description) for better search visibility
            </Text>
            <Text size={0}>
              - Use JSON import to bulk-update content with ChatGPT-generated descriptions
            </Text>
            <Text size={0}>
              - Duplicate existing services/blog posts to maintain formatting consistency
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Box>
  )
}
