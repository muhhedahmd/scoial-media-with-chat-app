import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { shapeOfPostsRes } from "../route"









export const GET = async  (req : Request)=>{
    const url = new URL(req.url)
    const post_id = +url.searchParams.get("post_id")!

    if(!post_id)
        return NextResponse.json({
            error : "invalid Request"
        } , {
            status : 404
        })

        try {
            const x = await prisma.post.findUnique({
                where : {
                    id : post_id
                },
                include: {
                    Share: {
                      include: {
                        post: {
                          select: {
                            author: {
                              select: { id: true },
                            },
              
                          },
                        },
                      },
                    },
                    // Include the parent post and its author
                    parent: {
                      // Assuming you have a self-referencing relationship called `parentPost`
                      select: {
                        id: true,
                        title:true,
                        author_id: true,
                        created_at: true,
                        updated_at: true,
                      },
                    },
                    _count: {
                      select: {
                        Interactions: true,
                      },
                    },
                  },
            })
            
            if(!x)
            {
                return NextResponse.json({ 
                    error : "Post not found"
                }, {
                    status : 404
                })
            
            }
            const fromat = {
                id: x.id,
                title: x.title,
                author_id: x.author_id,
                created_at: x.created_at,
                updated_at: x.updated_at,
                parentId: x.parentId,
                published: x.parentId,
                shared: x.Share
                  ? {
                      id: x.Share?.id,
                      content: x.Share.content,
                      post_id: x.Share?.post_id,
                      createdAt: x.Share?.createdAt,
                      updatedAt: x.Share?.updatedAt,
                      sharedBy_author_id: x.author_id,
                    }
                  : null,
                parent: x.parent && {
                  mainParentId: x.parent.id,
                  parent_author_id: x.parent.author_id,
                  created_at: x.parent.created_at,
                  updated_at: x.parent.updated_at,
                  parentTitle :x.parent.title
                },

            } as shapeOfPostsRes;
            
  
                
            return NextResponse.json(fromat as shapeOfPostsRes , {
                status : 200
            })
            
        } catch (error) {
            console.error(error)
            return NextResponse.json({
                error : "Server Error"  
            }, {
                status : 500
            })
            
        }
 
 }