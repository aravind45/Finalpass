import express from 'express';
import followUpService from '../services/followUpService.js';

const router = express.Router();

/**
 * GET /api/follow-ups/estate/:estateId
 * Get all follow-up recommendations for an estate
 */
router.get('/estate/:estateId', async (req, res) => {
  try {
    const estateId = parseInt(req.params.estateId);
    
    const recommendations = await followUpService.getFollowUpRecommendations(estateId);
    
    res.json({
      success: true,
      recommendations,
      count: recommendations.length
    });
  } catch (error) {
    console.error('Error fetching follow-up recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch follow-up recommendations'
    });
  }
});

/**
 * GET /api/follow-ups/asset/:assetId
 * Get follow-up recommendations for a specific asset
 */
router.get('/asset/:assetId', async (req, res) => {
  try {
    const assetId = parseInt(req.params.assetId);
    
    const recommendations = await followUpService.getAssetFollowUpRecommendations(assetId);
    
    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    console.error('Error fetching asset follow-up recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch asset follow-up recommendations'
    });
  }
});

/**
 * POST /api/follow-ups/escalate
 * Create an escalation for an asset
 */
router.post('/escalate', async (req, res) => {
  try {
    const { assetId, reason, daysSinceContact } = req.body;
    
    if (!assetId || !reason || daysSinceContact === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: assetId, reason, daysSinceContact'
      });
    }
    
    const escalation = await followUpService.createEscalation(
      parseInt(assetId),
      reason,
      parseInt(daysSinceContact)
    );
    
    res.json({
      success: true,
      escalation
    });
  } catch (error) {
    console.error('Error creating escalation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create escalation'
    });
  }
});

/**
 * PUT /api/follow-ups/escalation/:id/resolve
 * Resolve an escalation
 */
router.put('/escalation/:id/resolve', async (req, res) => {
  try {
    const escalationId = parseInt(req.params.id);
    
    const escalation = await followUpService.resolveEscalation(escalationId);
    
    res.json({
      success: true,
      escalation
    });
  } catch (error) {
    console.error('Error resolving escalation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to resolve escalation'
    });
  }
});

/**
 * GET /api/follow-ups/escalations/:estateId
 * Get all open escalations for an estate
 */
router.get('/escalations/:estateId', async (req, res) => {
  try {
    const estateId = parseInt(req.params.estateId);
    
    const escalations = await followUpService.getOpenEscalations(estateId);
    
    res.json({
      success: true,
      escalations,
      count: escalations.length
    });
  } catch (error) {
    console.error('Error fetching escalations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch escalations'
    });
  }
});

export default router;
