import { Router } from 'express';
import { getGAId, getGAConfig, getAllGAConfigs } from '../ga-config';

const router = Router();

/**
 * Get GA measurement ID for current domain
 */
router.get('/ga-config', (req, res) => {
  const host = req.get('host') || 'localhost';
  const domain = host.split(':')[0].toLowerCase();
  
  const config = getGAConfig(domain);
  
  res.json({
    success: true,
    data: {
      measurementId: config.measurementId,
      domain: config.domainName,
      description: config.description,
      detectedHost: host
    }
  });
});

/**
 * Get all GA configurations (for admin purposes)
 */
router.get('/ga-config/all', (req, res) => {
  const configs = getAllGAConfigs();
  
  res.json({
    success: true,
    data: configs
  });
});

/**
 * Get GA measurement ID for specific domain
 */
router.get('/ga-config/:domain', (req, res) => {
  const domain = req.params.domain;
  const config = getGAConfig(domain);
  
  res.json({
    success: true,
    data: {
      measurementId: config.measurementId,
      domain: config.domainName,
      description: config.description,
      requestedDomain: domain
    }
  });
});

export default router;