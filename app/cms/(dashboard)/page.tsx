import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CmsHomePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">You're logged in to the ACBS content admin panel.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Checkpoint 1 verification</CardTitle>
          <CardDescription>
            This confirms the passcode login, session, and route protection are working. Authors management will be
            added here next.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Try opening this page in a private/incognito window without logging in first — you should be redirected to
          the login page.
        </CardContent>
      </Card>
    </div>
  )
}
