import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import MainInfoEdit from "./mainInfoEdit"
import { ProfilePicture } from "@prisma/client"

export function TabsInfo( {
    blurCover ,
    blurProfile
}  :{
    blurCover : ProfilePicture | null
    blurProfile : ProfilePicture | null
}) {
    return (
        <Tabs defaultValue="account" className="w-[100%]">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="account">Main info</TabsTrigger>
                <TabsTrigger value="contact">contact info </TabsTrigger>
                <TabsTrigger value="Secondery">Secondery info </TabsTrigger>
            </TabsList>
            <TabsContent  value="account" className="h-full">
                <MainInfoEdit 

                editStatus={false}
                blurCover={blurCover}
                blurProfile={blurProfile}
                />

            </TabsContent>
            <TabsContent value="contact">
                <Card>
                    <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>
                            Change your password here. After saving, you'll be logged out.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="current">Current password</Label>
                            <Input id="current" type="password" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="new">New password</Label>
                            <Input id="new" type="password" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Save password</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
