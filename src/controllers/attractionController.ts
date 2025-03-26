import { Request, Response } from 'express';
import { prisma } from '../server';
import { upload } from '../utils/multerConfig';
import path from 'path';

export const getAttractions = async (req: Request, res: Response) => {
    try {
        const attractions = await prisma.attraction.findMany({
            include: {
                images: true, 
            },
             orderBy: {
        Favourite: {
          _count: 'desc',
        },
      },
        });
        return res.status(200).json(attractions);
    } catch (error) {
        console.error('Error details:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


export const createAttraction = async (req: Request, res: Response) => {


  try {
  
    console.log('Request Body:', req.body);
    console.log('Uploaded Files:', req.files)
    
    const imageUrls = (req.files as Express.Multer.File[]).map(file => `/uploads/${path.basename(file.path)}`) || [];

 
    const { name, address, budget, website_link } = req.body;

    const attraction = await prisma.attraction.create({
      data: {
        name,
        address,
        budget,
        website_link: website_link || null,
        images: {
          create: imageUrls.map(url => ({ url })),
        },
      },
      include: {
        images: true,
      },
    });

    return res.status(201).json(attraction);
  } catch (error) {
    console.error('Error details:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};



export const getAttractionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const attraction = await prisma.attraction.findUnique({ where: { id: Number(id) } });
        if (!attraction) {
            return res.status(404).json({ error: 'Attraction not found' });
        }
        return res.status(200).json(attraction);
    } catch (error) {
        console.error('Error details:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
