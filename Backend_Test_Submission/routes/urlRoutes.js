import express from 'express';
import shortid from 'shortid';
import Url from '../models/Url.js';
import { Log } from '../../Logging_Middleware/logger.js';
import geoip from 'geoip-lite';

const router = express.Router();

router.post('/shorten', async (req, res) => {
  const { originalUrl, customSlug, validity } = req.body;
  const slug = customSlug || shortid.generate();

  try {
    const exists = await Url.findOne({ slug });
    if (exists) {
      Log('backend', 'warn', 'handler', 'Slug already exists');
      return res.status(409).json({ message: 'Slug already exists' });
    }

    const expiresAt = validity ? new Date(Date.now() + validity * 60000) : null;

    const newUrl = new Url({ slug, originalUrl, expiresAt });
    await newUrl.save();

    Log('backend', 'info', 'handler', `Created short URL for ${originalUrl} -> ${slug}`);
    res.json({
      shortUrl: `http://localhost:5000/${slug}`,
      expiresAt,
    });
  } catch (err) {
    Log('backend', 'error', 'handler', 'Shorten failed: ' + err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const url = await Url.findOne({ slug: req.params.slug });
    if (!url) {
      Log('backend', 'warn', 'handler', 'Slug not found');
      return res.status(404).send('Not found');
    }

    if (url.expiresAt && new Date() > url.expiresAt) {
      return res.status(410).send('URL expired');
    }

    url.clicks++;

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip) || {};

    url.clickDetails.push({
      source: req.headers.referer || 'direct',
      location: geo.city || geo.country || 'unknown',
    });

    await url.save();
    res.redirect(url.originalUrl);
  } catch (err) {
    Log('backend', 'error', 'handler', 'Redirect error: ' + err.message);
    res.status(500).send('Error');
  }
});

router.get('/analytics/:slug', async (req, res) => {
  try {
    const url = await Url.findOne({ slug: req.params.slug });
    if (!url) return res.status(404).send('Not found');

    res.json({
      originalUrl: url.originalUrl,
      slug: url.slug,
      clicks: url.clicks,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
      clickDetails: url.clickDetails,
    });
  } catch (err) {
    Log('backend', 'error', 'handler', 'Analytics error: ' + err.message);
    res.status(500).send('Error');
  }
});

router.get('/all-urls', async (req, res) => {
  try {
    const urls = await Url.find();
    res.json(urls);
  } catch (err) {
    Log('backend', 'error', 'handler', 'All-URLs fetch error: ' + err.message);
    res.status(500).send('Error');
  }
});

export default router;
